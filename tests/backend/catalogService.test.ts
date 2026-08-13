import {
  getCategories,
  getProducts,
  getProductById,
  getFacetedFilters,
  localizeCategory,
  localizeProduct,
  FALLBACK_PRODUCTS,
  FALLBACK_CATEGORIES
} from '../../src/backend/src/services/catalogService';

jest.mock('../../src/backend/src/config/spanner', () => ({
  executeSpannerSql: jest.fn().mockResolvedValue(null),
  projectId: 'hifi-shop-demo'
}));

describe('catalogService Unit Tests', () => {
  describe('Dual-Language Category & Product Resolution', () => {
    it('should resolve categories in English (en-US)', async () => {
      const categories = await getCategories('en-US');
      expect(categories.length).toBeGreaterThan(0);
      const dacCat = categories.find(c => c.category_id === 'dacs');
      expect(dacCat?.name).toBe('DACs (Digital-to-Analog Converters)');
    });

    it('should resolve categories in Traditional Chinese (zh-HK)', async () => {
      const categories = await getCategories('zh-HK');
      expect(categories.length).toBeGreaterThan(0);
      const dacCat = categories.find(c => c.category_id === 'dacs');
      expect(dacCat?.name).toBe('解碼器 (DACs)');
    });

    it('should localize individual product attributes based on requested language', () => {
      const rawProduct = FALLBACK_PRODUCTS[0]; // Chord Hugo TT 2
      const localizedEn = localizeProduct(rawProduct, 'en-US');
      const localizedZh = localizeProduct(rawProduct, 'zh-HK');

      expect(localizedEn.name).toBe(rawProduct.name_en);
      expect(localizedZh.name).toBe(rawProduct.name_zh);
      expect(localizedZh.description).toBe(rawProduct.description_zh);
      expect(localizedZh.acoustic_signature).toBe(rawProduct.acoustic_signature_zh);
    });

    it('should get product by ID with language localization', async () => {
      const productEn = await getProductById('prod-sennheiser-hd800s', 'en-US');
      const productZh = await getProductById('prod-sennheiser-hd800s', 'zh-HK');

      expect(productEn).not.toBeNull();
      expect(productEn?.brand).toBe('Sennheiser');
      expect(productEn?.name).toContain('Reference Open-Back Headphones');

      expect(productZh).not.toBeNull();
      expect(productZh?.name).toContain('參考級開放式頭戴耳機');
    });

    it('should return null for non-existent product ID', async () => {
      const product = await getProductById('non-existent-id');
      expect(product).toBeNull();
    });
  });

  describe('HKD Price Filter Boundary Conditions', () => {
    it('should filter products with min_price boundary', async () => {
      const minPrice = 39800;
      const res = await getProducts({ min_price: minPrice });
      expect(res.products.length).toBeGreaterThan(0);
      res.products.forEach(p => {
        expect(p.price_hkd).toBeGreaterThanOrEqual(minPrice);
      });
    });

    it('should filter products with max_price boundary', async () => {
      const maxPrice = 10000;
      const res = await getProducts({ max_price: maxPrice });
      expect(res.products.length).toBeGreaterThan(0);
      res.products.forEach(p => {
        expect(p.price_hkd).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should handle price range where min_price equals max_price (exact price match)', async () => {
      const targetPrice = 39800;
      const res = await getProducts({ min_price: targetPrice, max_price: targetPrice });
      expect(res.products.length).toBeGreaterThan(0);
      res.products.forEach(p => {
        expect(p.price_hkd).toBe(targetPrice);
      });
    });

    it('should return zero products when min_price is strictly greater than max_price', async () => {
      const res = await getProducts({ min_price: 50000, max_price: 10000 });
      expect(res.products).toHaveLength(0);
      expect(res.total).toBe(0);
    });

    it('should return zero products when price range is out of bound', async () => {
      const res = await getProducts({ min_price: 999999 });
      expect(res.products).toHaveLength(0);
    });
  });

  describe('Brand Facets & Output Ports Filtering', () => {
    it('should extract faceted filter options (brands, output ports, price range)', async () => {
      const facets = await getFacetedFilters('dacs');
      expect(facets.brands).toContain('Chord Electronics');
      expect(facets.brands).toContain('Denafrips');
      expect(facets.output_ports.length).toBeGreaterThan(0);
      expect(facets.price_range.min).toBeGreaterThan(0);
      expect(facets.price_range.max).toBeGreaterThan(facets.price_range.min);
    });

    it('should filter products by a single brand string', async () => {
      const res = await getProducts({ brand: 'Denafrips' });
      expect(res.products.length).toBeGreaterThan(0);
      res.products.forEach(p => {
        expect(p.brand.toLowerCase()).toContain('denafrips');
      });
    });

    it('should filter products by array of brands', async () => {
      const res = await getProducts({ brand: ['Chord Electronics', 'Topping'] });
      expect(res.products.length).toBeGreaterThan(0);
      res.products.forEach(p => {
        const match = p.brand.toLowerCase().includes('chord') || p.brand.toLowerCase().includes('topping');
        expect(match).toBe(true);
      });
    });

    it('should filter products by output port specification', async () => {
      const res = await getProducts({ output_ports: 'XLR' });
      expect(res.products.length).toBeGreaterThan(0);
    });
  });
});
