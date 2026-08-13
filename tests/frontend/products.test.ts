import { adaptProduct, parseSpannerNumeric } from '../../src/frontend/src/data/products';

describe('products.ts - parseSpannerNumeric & adaptProduct', () => {
  describe('parseSpannerNumeric', () => {
    it('should parse standard positive numbers correctly', () => {
      expect(parseSpannerNumeric(39800)).toBe(39800);
      expect(parseSpannerNumeric(14200.5)).toBe(14200.5);
    });

    it('should parse numeric strings and formatted currency strings', () => {
      expect(parseSpannerNumeric('39800')).toBe(39800);
      expect(parseSpannerNumeric('39,800.00')).toBe(39800);
      expect(parseSpannerNumeric('HK$ 58,000')).toBe(58000);
    });

    it('should parse Spanner NUMERIC object payloads safely', () => {
      expect(parseSpannerNumeric({ value: '39800' })).toBe(39800);
      expect(parseSpannerNumeric({ val: 24800 })).toBe(24800);
      expect(parseSpannerNumeric({ amount: '78000' })).toBe(78000);
      expect(parseSpannerNumeric({ toString: () => '108000' })).toBe(108000);
    });

    it('should prevent NaN and 0 or negative prices by returning 0', () => {
      expect(parseSpannerNumeric(NaN)).toBe(0);
      expect(parseSpannerNumeric(0)).toBe(0);
      expect(parseSpannerNumeric(-500)).toBe(0);
      expect(parseSpannerNumeric(null)).toBe(0);
      expect(parseSpannerNumeric(undefined)).toBe(0);
      expect(parseSpannerNumeric('invalid_number')).toBe(0);
    });
  });

  describe('adaptProduct', () => {
    it('should safely parse priceHkd / price_hkd with Spanner numeric object inputs', () => {
      const raw = {
        id: 'dac-001',
        brand: 'LampiZator',
        model: 'Horizon DAC',
        name_en: 'Horizon Tube DAC',
        name_zh: 'Horizon 旗艦膽解碼器',
        price_hkd: { value: '39800' },
        description_en: 'Flagship tube DAC',
        description_zh: '旗艦膽解碼器',
        imageUrl: '/images/dac.jpg'
      };

      const product = adaptProduct(raw);
      expect(product.priceHkd).toBe(39800);
      expect(product.price_hkd).toBe(39800);
      expect(product.id).toBe('dac-001');
    });

    it('should safely parse priceHkd when given as numeric string', () => {
      const raw = {
        id: 'amp-001',
        brand: 'Feliks Audio',
        model: 'Envy 300B',
        priceHkd: '58,000',
        imageUrl: '/images/amp.jpg'
      };

      const product = adaptProduct(raw);
      expect(product.priceHkd).toBe(58000);
      expect(product.price_hkd).toBe(58000);
    });

    it('should default price to 0 when input price is invalid or missing, preventing NaN', () => {
      const raw = {
        id: 'item-001',
        brand: 'Generic',
        model: 'Model X',
        price_hkd: 'invalid'
      };

      const product = adaptProduct(raw);
      expect(product.priceHkd).toBe(0);
      expect(product.price_hkd).toBe(0);
      expect(Number.isNaN(product.priceHkd)).toBe(false);
    });
  });
});
