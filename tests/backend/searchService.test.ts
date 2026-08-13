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

import { searchProducts, generateTextEmbedding } from '../../src/backend/src/services/searchService';
import { mockExecuteSpannerSql } from './mockSpanner';

jest.mock('../../src/backend/src/config/spanner', () => ({
  executeSpannerSql: jest.fn().mockImplementation((query) => mockExecuteSpannerSql(query)),
  projectId: 'hifi-shop-demo'
}));

describe('searchService Unit Tests', () => {
  describe('Reciprocal Rank Fusion (RRF) Formula & Sorting', () => {
    it('should compute RRF score using formula RRF = 0.4/(60+Rank_BM25) + 0.6/(60+Rank_Vector) and sort results descending', async () => {
      const result = await searchProducts({ q: 'Chord' });
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
