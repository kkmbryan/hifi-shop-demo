jest.mock('@google-cloud/aiplatform', () => {
  class MockPredictionServiceClient {
    predict() {
      const mockValues = new Array(768).fill(1 / Math.sqrt(768)).map(v => ({ numberValue: v }));
      return Promise.resolve([
        {
          predictions: [
            {
              structValue: {
                fields: {
                  embeddings: {
                    structValue: {
                      fields: {
                        values: {
                          listValue: {
                            values: mockValues
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      ]);
    }
  }
  return {
    v1: {
      PredictionServiceClient: MockPredictionServiceClient
    }
  };
});

import { searchProducts, searchProductsFtsOnly, generateTextEmbedding } from '../../src/backend/src/services/searchService';
import { mockExecuteSpannerSql } from './mockSpanner';

jest.mock('../../src/backend/src/config/spanner', () => ({
  executeSpannerSql: jest.fn().mockImplementation((query) => mockExecuteSpannerSql(query)),
  projectId: 'hifi-shop-demo'
}));

describe('searchService Unit Tests', () => {
  describe('Pure Full-Text Search (searchProductsFtsOnly & mode: "fts")', () => {
    it('should search by Chinese category names (解碼器, 擴音機, 黑膠唱機, 耳機, 音箱, 線材)', async () => {
      const dacResult = await searchProductsFtsOnly({ q: '解碼器' });
      expect(dacResult.products.length).toBeGreaterThan(0);
      expect(dacResult.products.some(p => p.category_id === 'dacs')).toBe(true);

      const ampResult = await searchProducts({ q: '擴音機', mode: 'fts' });
      expect(ampResult.products.length).toBeGreaterThan(0);
      expect(ampResult.products.some(p => p.category_id === 'amplifiers')).toBe(true);

      const turntableResult = await searchProductsFtsOnly({ q: '黑膠唱機' });
      expect(turntableResult.products.length).toBeGreaterThan(0);
      expect(turntableResult.products.some(p => p.category_id === 'turntables')).toBe(true);

      const headphoneResult = await searchProductsFtsOnly({ q: '耳機' });
      expect(headphoneResult.products.length).toBeGreaterThan(0);
      expect(headphoneResult.products.some(p => p.category_id === 'head-fi')).toBe(true);

      const speakerResult = await searchProductsFtsOnly({ q: '音箱' });
      expect(speakerResult.products.length).toBeGreaterThan(0);
      expect(speakerResult.products.some(p => p.category_id === 'loudspeakers')).toBe(true);

      const cableResult = await searchProductsFtsOnly({ q: '線材' });
      expect(cableResult.products.length).toBeGreaterThan(0);
      expect(cableResult.products.some(p => p.category_id === 'cables')).toBe(true);
    });

    it('should search by Chinese technical & description keywords (數碼, 真空管, PCM)', async () => {
      const tubeResult = await searchProductsFtsOnly({ q: '真空管' });
      expect(tubeResult.products.length).toBeGreaterThan(0);
      expect(tubeResult.products.some(p => p.product_id === 'prod-feliks-envy')).toBe(true);

      const digitalResult = await searchProducts({ q: '數碼', mode: 'fts' });
      expect(digitalResult.products.length).toBeGreaterThan(0);

      const pcmResult = await searchProductsFtsOnly({ q: 'PCM' });
      expect(pcmResult.products.length).toBeGreaterThan(0);
    });

    it('should search by alphanumeric model codes (HD 800, TT 2, D90)', async () => {
      const hdResult = await searchProductsFtsOnly({ q: 'HD 800' });
      expect(hdResult.products.length).toBeGreaterThan(0);
      expect(hdResult.products.some(p => p.product_id === 'prod-sennheiser-hd800s')).toBe(true);

      const ttResult = await searchProducts({ q: 'TT 2', mode: 'fts' });
      expect(ttResult.products.length).toBeGreaterThan(0);
      expect(ttResult.products[0].model).toContain('Hugo TT 2');

      const d90Result = await searchProductsFtsOnly({ q: 'D90' });
      expect(d90Result.products.length).toBeGreaterThan(0);
      expect(d90Result.products[0].brand).toBe('Topping');
    });

    it('should search by acoustic signature keywords (溫暖, 人聲, soundstage)', async () => {
      const warmResult = await searchProductsFtsOnly({ q: '溫暖' });
      expect(warmResult.products.length).toBeGreaterThan(0);

      const vocalResult = await searchProducts({ q: '人聲', mode: 'fts' });
      expect(vocalResult.products.length).toBeGreaterThan(0);

      const soundstageResult = await searchProductsFtsOnly({ q: 'soundstage' });
      expect(soundstageResult.products.length).toBeGreaterThan(0);
    });

    it('should support category, brand, and price filters in FTS mode', async () => {
      const filteredResult = await searchProductsFtsOnly({
        q: 'DAC',
        category: 'dacs',
        min_price: 20000,
        max_price: 50000,
        brand: 'Chord'
      });

      expect(filteredResult.products.length).toBeGreaterThan(0);
      filteredResult.products.forEach(p => {
        expect(p.category_id).toBe('dacs');
        expect(p.brand).toContain('Chord');
        expect(p.price_hkd).toBeGreaterThanOrEqual(20000);
        expect(p.price_hkd).toBeLessThanOrEqual(50000);
      });
    });

    it('should project category_name_en, category_name_zh, and localized category fields', async () => {
      const resultEn = await searchProductsFtsOnly({ q: 'Hugo', lang: 'en-US' });
      expect(resultEn.products.length).toBeGreaterThan(0);
      const topEn = resultEn.products[0];
      expect(topEn.category_name_en).toBeDefined();
      expect(topEn.category_name_zh).toBeDefined();
      expect(topEn.category_name).toBe(topEn.category_name_en);

      const resultZh = await searchProductsFtsOnly({ q: 'Hugo', lang: 'zh-HK' });
      expect(resultZh.products.length).toBeGreaterThan(0);
      const topZh = resultZh.products[0];
      expect(topZh.category_name).toBe(topZh.category_name_zh);
    });
  });

  describe('Reciprocal Rank Fusion (RRF) Formula & Sorting in Hybrid Mode', () => {
    it('should compute RRF score using formula RRF = 0.4/(60+Rank_BM25) + 0.6/(60+Rank_Vector) and sort results descending', async () => {
      const result = await searchProducts({ q: 'Chord', mode: 'hybrid' });
      expect(result.products.length).toBeGreaterThan(0);

      // Verify each product has RRF metadata and matches formula
      result.products.forEach((product) => {
        const bm25Rank = product.bm25_rank || 999;
        const vectorRank = product.vector_rank || 999;
        const expectedTermBM25 = bm25Rank !== 999 ? 0.4 / (60 + bm25Rank) : 0;
        const expectedTermVector = vectorRank !== 999 ? 0.6 / (60 + vectorRank) : 0;
        const expectedRRF = Number((expectedTermBM25 + expectedTermVector).toFixed(6));

        expect(product.rrf_score).toBeCloseTo(expectedRRF, 5);
      });

      // Verify sorting order: descending by rrf_score
      for (let i = 0; i < result.products.length - 1; i++) {
        expect(result.products[i].rrf_score!).toBeGreaterThanOrEqual(result.products[i + 1].rrf_score!);
      }
    });

    it('should correctly prioritize products matching both BM25 and Vector ranks', async () => {
      const result = await searchProducts({ q: 'tube' });
      expect(result.products.length).toBeGreaterThan(0);
      const topProduct = result.products[0];
      expect(topProduct.rrf_score).toBeGreaterThan(0);
      expect(topProduct.bm25_rank).toBeLessThanOrEqual(999);
      expect(topProduct.vector_rank).toBeLessThanOrEqual(999);
    });

    it('should project flattened category fields in hybrid search results', async () => {
      const result = await searchProducts({ q: 'Sennheiser', lang: 'zh-HK' });
      expect(result.products.length).toBeGreaterThan(0);
      const product = result.products[0];
      expect(product.category_name_en).toBeDefined();
      expect(product.category_name_zh).toBeDefined();
      expect(product.category_name).toBe(product.category_name_zh);
    });
  });

  describe('Fallback Hybrid Search Execution', () => {
    it('should handle empty query gracefully by returning empty product list', async () => {
      const result = await searchProducts({ q: '' });
      expect(result.products).toEqual([]);
      expect(result.total_matches).toBe(0);
      expect(result.query).toBe('');
    });

    it('should handle whitespace query gracefully', async () => {
      const result = await searchProducts({ q: '   ' });
      expect(result.products).toEqual([]);
      expect(result.total_matches).toBe(0);
    });

    it('should execute fallback search when Spanner is unavailable and filter by category', async () => {
      const result = await searchProducts({ q: 'DAC', category: 'dacs' });
      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((p) => {
        expect(p.category_id.toLowerCase()).toBe('dacs');
      });
    });

    it('should execute fallback search with price boundary filtering', async () => {
      const minPrice = 10000;
      const maxPrice = 40000;
      const result = await searchProducts({ q: 'amplifier', min_price: minPrice, max_price: maxPrice });

      result.products.forEach((p) => {
        expect(p.price_hkd).toBeGreaterThanOrEqual(minPrice);
        expect(p.price_hkd).toBeLessThanOrEqual(maxPrice);
      });
    });

    it('should execute fallback search with brand filtering', async () => {
      const result = await searchProducts({ q: 'headphones', brand: 'Sennheiser' });
      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((p) => {
        expect(p.brand.toLowerCase()).toContain('sennheiser');
      });
    });
  });

  describe('Text Embedding Generator', () => {
    it('should return a 768-dimensional normalized fallback vector for input text', async () => {
      const text = 'warm tube vocal DAC';
      const embedding = await generateTextEmbedding(text);

      expect(embedding).toHaveLength(768);
      
      // Check unit length normalization (magnitude ≈ 1)
      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      expect(norm).toBeCloseTo(1.0, 4);
    });

    it('should produce deterministic embeddings for identical inputs in fallback mode', async () => {
      const text = 'Sennheiser HD 800 S';
      const vec1 = await generateTextEmbedding(text);
      const vec2 = await generateTextEmbedding(text);

      expect(vec1).toEqual(vec2);
    });
  });
});
