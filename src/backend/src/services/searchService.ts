import { v1 as aiplatform } from '@google-cloud/aiplatform';
import { executeSpannerSql, projectId } from '../config/spanner';
import { FALLBACK_PRODUCTS, localizeProduct, Product } from './catalogService';

export interface HybridSearchOptions {
  q: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  lang?: string;
  limit?: number;
  offset?: number;
}

export interface HybridSearchResult {
  query: string;
  total_matches: number;
  execution_time_ms: number;
  limit: number;
  offset: number;
  products: Product[];
}

const K_RRF = 60;
const WEIGHT_BM25 = 0.4;
const WEIGHT_VECTOR = 0.6;
const EMBEDDING_DIM = 768;

/**
 * Generate 768-dimensional vector embedding for text using Vertex AI or fallback.
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    const location = process.env.GCP_LOCATION || 'us-central1';
    const clientOptions = {
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
    };
    const predictionServiceClient = new aiplatform.PredictionServiceClient(clientOptions);

    const endpoint = `projects/${projectId}/locations/${location}/publishers/google/models/text-embedding-004`;
    const instance = {
      structValue: {
        fields: {
          content: { stringValue: text }
        }
      }
    };
    const instances = [instance as any];

    const request = {
      endpoint,
      instances,
    };

    const [response] = await predictionServiceClient.predict(request);
    if (response.predictions && response.predictions.length > 0) {
      const prediction: any = response.predictions[0];
      const embeddingsStruct = prediction.structValue?.fields?.embeddings;
      const values = embeddingsStruct?.structValue?.fields?.values?.listValue?.values;
      if (values) {
        return values.map((v: any) => v.numberValue || 0);
      }
    }
  } catch (err) {
    console.warn('[Vertex AI Warning] Could not generate embedding via Vertex AI API, using normalized fallback embedding vector:', (err as Error).message);
  }

  // Fallback: Generate a normalized 768-dim float vector derived deterministically from the string
  return generateFallbackEmbedding(text);
}

function generateFallbackEmbedding(text: string): number[] {
  const vector: number[] = new Array(EMBEDDING_DIM).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    const val = Math.sin(hash + i * 0.1);
    vector[i] = val;
  }

  // Normalize to unit length for Cosine Similarity
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map(v => v / (norm || 1));
}

/**
 * Calculate Cosine Distance between two 768-dim float arrays.
 * Distance = 1 - Cosine Similarity
 */
function calculateCosineDistance(vecA: number[], vecB: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < Math.min(vecA.length, vecB.length); i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 1.0;
  const similarity = dot / denominator;
  return 1.0 - similarity;
}

/**
 * Execute Hybrid Search using Cloud Spanner BM25 + Vector KNN, merged via Reciprocal Rank Fusion (RRF).
 * RRF = 0.4 / (60 + Rank_BM25) + 0.6 / (60 + Rank_Vector)
 */
export async function searchProducts(options: HybridSearchOptions): Promise<HybridSearchResult> {
  const startTime = Date.now();
  const queryText = (options.q || '').trim();
  const limit = options.limit || 20;
  const offset = options.offset || 0;

  if (!queryText) {
    return {
      query: '',
      total_matches: 0,
      execution_time_ms: Date.now() - startTime,
      limit,
      offset,
      products: []
    };
  }

  // Generate 768-dim embedding for query
  const queryEmbedding = await generateTextEmbedding(queryText);

  // Attempt Spanner Hybrid Execution
  const spannerResult = await executeSpannerHybridSearch(queryText, queryEmbedding, options);
  if (spannerResult) {
    const executionTime = Date.now() - startTime;
    return {
      ...spannerResult,
      execution_time_ms: executionTime,
    };
  }

  // Fallback Hybrid Search Execution
  const fallbackResult = executeFallbackHybridSearch(queryText, queryEmbedding, options);
  const executionTime = Date.now() - startTime;

  return {
    ...fallbackResult,
    execution_time_ms: executionTime,
  };
}

/**
 * Execute Cloud Spanner Hybrid Search (BM25 Search Index + Vector COSINE Distance).
 */
async function executeSpannerHybridSearch(
  queryText: string,
  queryEmbedding: number[],
  options: HybridSearchOptions
): Promise<Omit<HybridSearchResult, 'execution_time_ms'> | null> {
  try {
    // 1. BM25 Search Query
    const bm25Sql = `
      SELECT product_id, name_en, name_zh, brand, price_hkd
      FROM Products
      WHERE SEARCH(Products, @query) AND is_active = true
      LIMIT 50
    `;
    const bm25Rows = await executeSpannerSql<{ product_id: string }>({
      sql: bm25Sql,
      params: { query: queryText }
    });

    if (!bm25Rows) return null;

    // 2. Vector Cosine KNN Distance Query
    const vectorSql = `
      SELECT e.product_id, COSINE_DISTANCE(e.embedding, @query_embedding) AS distance
      FROM ProductEmbeddings e
      JOIN Products p ON e.product_id = p.product_id
      WHERE p.is_active = true
      ORDER BY distance ASC
      LIMIT 50
    `;
    const vectorRows = await executeSpannerSql<{ product_id: string; distance: number }>({
      sql: vectorSql,
      params: { query_embedding: queryEmbedding }
    });

    if (!vectorRows) return null;

    // Build Rank maps
    const bm25Ranks = new Map<string, number>();
    bm25Rows.forEach((row, index) => {
      bm25Ranks.set(row.product_id, index + 1);
    });

    const vectorRanks = new Map<string, number>();
    vectorRows.forEach((row, index) => {
      vectorRanks.set(row.product_id, index + 1);
    });

    // Collect all candidate product IDs
    const candidateIds = Array.from(new Set([...bm25Ranks.keys(), ...vectorRanks.keys()]));

    // Compute RRF Scores & Fetch Full Product Objects
    const scoredProducts: { product: Product; rrf_score: number; bm25_rank: number; vector_rank: number }[] = [];

    for (const pid of candidateIds) {
      const bm25Rank = bm25Ranks.get(pid);
      const vectorRank = vectorRanks.get(pid);

      const bm25ScoreTerm = bm25Rank ? WEIGHT_BM25 / (K_RRF + bm25Rank) : 0;
      const vectorScoreTerm = vectorRank ? WEIGHT_VECTOR / (K_RRF + vectorRank) : 0;
      const rrfScore = bm25ScoreTerm + vectorScoreTerm;

      // Fetch product details
      const pSql = `SELECT * FROM Products WHERE product_id = @product_id AND is_active = true`;
      const pRows = await executeSpannerSql<Product>({ sql: pSql, params: { product_id: pid } });
      if (pRows && pRows.length > 0) {
        const product = pRows[0];
        // Apply Filters
        if (options.category && product.category_id.toLowerCase() !== options.category.toLowerCase()) continue;
        if (options.min_price !== undefined && product.price_hkd < options.min_price) continue;
        if (options.max_price !== undefined && product.price_hkd > options.max_price) continue;
        if (options.brand && !product.brand.toLowerCase().includes(options.brand.toLowerCase())) continue;

        scoredProducts.push({
          product,
          rrf_score: rrfScore,
          bm25_rank: bm25Rank || 999,
          vector_rank: vectorRank || 999,
        });
      }
    }

    // Sort descending by RRF score
    scoredProducts.sort((a, b) => b.rrf_score - a.rrf_score);

    const limit = options.limit || 20;
    const offset = options.offset || 0;
    const paginated = scoredProducts.slice(offset, offset + limit).map(item => ({
      ...localizeProduct(item.product, options.lang),
      rrf_score: Number(item.rrf_score.toFixed(6)),
      bm25_rank: item.bm25_rank,
      vector_rank: item.vector_rank,
    }));

    return {
      query: queryText,
      total_matches: scoredProducts.length,
      limit,
      offset,
      products: paginated,
    };
  } catch (err) {
    console.warn('[Spanner Hybrid Search Warning] Spanner hybrid search query failed, using in-memory RRF engine:', (err as Error).message);
    return null;
  }
}

/**
 * Execute In-Memory Fallback Hybrid Search (BM25 Token Matching + Vector Cosine RRF).
 */
function executeFallbackHybridSearch(
  queryText: string,
  queryEmbedding: number[],
  options: HybridSearchOptions
): Omit<HybridSearchResult, 'execution_time_ms'> {
  const queryLower = queryText.toLowerCase();

  // 1. In-Memory BM25 / Keyword Scoring
  const bm25Candidates: { product: Product; score: number }[] = [];
  FALLBACK_PRODUCTS.forEach(product => {
    let score = 0;
    if (product.name_en.toLowerCase().includes(queryLower) || product.name_zh.includes(queryText)) score += 10;
    if (product.brand.toLowerCase().includes(queryLower)) score += 8;
    if (product.model.toLowerCase().includes(queryLower)) score += 8;
    if (product.acoustic_signature_en.toLowerCase().includes(queryLower) || product.acoustic_signature_zh.includes(queryText)) score += 5;
    if (product.description_en.toLowerCase().includes(queryLower) || product.description_zh.includes(queryText)) score += 3;

    if (score > 0) {
      bm25Candidates.push({ product, score });
    }
  });

  bm25Candidates.sort((a, b) => b.score - a.score);
  const bm25Ranks = new Map<string, number>();
  bm25Candidates.forEach((item, idx) => bm25Ranks.set(item.product.product_id, idx + 1));

  // 2. In-Memory Vector Distance Scoring
  const vectorCandidates: { product: Product; distance: number }[] = [];
  FALLBACK_PRODUCTS.forEach(product => {
    // Generate text vector for product acoustic signature + description
    const textToEmbed = `${product.name_en} ${product.acoustic_signature_en} ${product.description_en}`;
    const productEmbed = generateFallbackEmbedding(textToEmbed);
    const dist = calculateCosineDistance(queryEmbedding, productEmbed);
    vectorCandidates.push({ product, distance: dist });
  });

  vectorCandidates.sort((a, b) => a.distance - b.distance);
  const vectorRanks = new Map<string, number>();
  vectorCandidates.forEach((item, idx) => vectorRanks.set(item.product.product_id, idx + 1));

  // 3. Compute RRF Scores
  const allProductIds = Array.from(new Set([...FALLBACK_PRODUCTS.map(p => p.product_id)]));
  const scoredProducts: { product: Product; rrf_score: number; bm25_rank: number; vector_rank: number }[] = [];

  for (const pid of allProductIds) {
    const product = FALLBACK_PRODUCTS.find(p => p.product_id === pid)!;

    // Apply Structural Filters
    if (options.category && product.category_id.toLowerCase() !== options.category.toLowerCase()) continue;
    if (options.min_price !== undefined && product.price_hkd < options.min_price) continue;
    if (options.max_price !== undefined && product.price_hkd > options.max_price) continue;
    if (options.brand && !product.brand.toLowerCase().includes(options.brand.toLowerCase())) continue;

    const bm25Rank = bm25Ranks.get(pid);
    const vectorRank = vectorRanks.get(pid);

    const bm25Term = bm25Rank ? WEIGHT_BM25 / (K_RRF + bm25Rank) : 0;
    const vectorTerm = vectorRank ? WEIGHT_VECTOR / (K_RRF + vectorRank) : 0;
    const rrfScore = bm25Term + vectorTerm;

    if (rrfScore > 0) {
      scoredProducts.push({
        product,
        rrf_score: rrfScore,
        bm25_rank: bm25Rank || 999,
        vector_rank: vectorRank || 999,
      });
    }
  }

  scoredProducts.sort((a, b) => b.rrf_score - a.rrf_score);

  const limit = options.limit || 20;
  const offset = options.offset || 0;
  const paginated = scoredProducts.slice(offset, offset + limit).map(item => ({
    ...localizeProduct(item.product, options.lang),
    rrf_score: Number(item.rrf_score.toFixed(6)),
    bm25_rank: item.bm25_rank,
    vector_rank: item.vector_rank,
  }));

  return {
    query: queryText,
    total_matches: scoredProducts.length,
    limit,
    offset,
    products: paginated,
  };
}
