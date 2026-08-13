import { v1 as aiplatform } from "@google-cloud/aiplatform";
import { executeSpannerSql, projectId } from "../config/spanner";
import { localizeProduct, Product, ProductSpecification } from "./catalogService";

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

const ACTIVE_BUCKET_NAME = process.env.GCS_BUCKET_NAME || "bryanko-hifi-shop-demo-assets";

/**
 * Helper function that extracts numbers from Spanner NUMERIC objects ({ value: "39800.00" }),
 * numeric strings, or raw numbers.
 */
export function parseSpannerNumeric(val: any): number {
  if (val === null || val === undefined) {
    return 0;
  }
  if (typeof val === "number") {
    return Number.isNaN(val) ? 0 : val;
  }
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val === "object" && val !== null) {
    if ("value" in val && val.value !== undefined && val.value !== null) {
      return parseSpannerNumeric(val.value);
    }
  }
  const num = Number(val);
  return Number.isNaN(num) ? 0 : num;
}

/**
 * Sanitizes image URLs by dynamically replacing legacy bucket names with the active bucket name (bryanko-hifi-shop-demo-assets).
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  const sanitized = String(url).trim();
  if (/^https?:\/\/storage\.googleapis\.com\/[^\/]+(\/.*)?$/i.test(sanitized)) {
    return sanitized.replace(/^(https?:\/\/storage\.googleapis\.com\/)[^\/]+(\/.*)?$/i, `$1${ACTIVE_BUCKET_NAME}$2`);
  }
  if (/^gs:\/\/[^\/]+(\/.*)?$/i.test(sanitized)) {
    return sanitized.replace(/^(gs:\/\/)[^\/]+(\/.*)?$/i, `$1${ACTIVE_BUCKET_NAME}$2`);
  }
  if (!/^https?:\/\//i.test(sanitized) && !/^gs:\/\//i.test(sanitized)) {
    const cleanPath = sanitized.startsWith("/") ? sanitized.slice(1) : sanitized;
    return `https://storage.googleapis.com/${ACTIVE_BUCKET_NAME}/${cleanPath}`;
  }
  return sanitized;
}

/**
 * Singleton instance of Vertex AI PredictionServiceClient for embedding generation.
 */
let predictionServiceClientInstance: aiplatform.PredictionServiceClient | null = null;

function getPredictionServiceClient(): aiplatform.PredictionServiceClient {
  if (!predictionServiceClientInstance) {
    const location = process.env.GCP_LOCATION || "us-central1";
    const clientOptions = {
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
    };
    predictionServiceClientInstance = new aiplatform.PredictionServiceClient(clientOptions);
  }
  return predictionServiceClientInstance;
}

/**
 * Generate 768-dimensional vector embedding for text using Vertex AI text-embedding-004 model.
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    const location = process.env.GCP_LOCATION || "us-central1";
    const predictionServiceClient = getPredictionServiceClient();

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
      if (values && values.length > 0) {
        return values.map((v: any) => v.numberValue || 0);
      }
    }
  } catch (err) {
    console.warn("[Vertex AI Warning] Could not generate embedding via Vertex AI API:", (err as Error).message);
  }

  return new Array(EMBEDDING_DIM).fill(0);
}

/**
 * Execute Cloud Spanner Hybrid Search (BM25 Keyword Search + 768-dim Vector COSINE Distance merged via RRF).
 * RRF Score = (0.4 / (60 + Rank_BM25)) + (0.6 / (60 + Rank_Vector))
 * Throws explicit Error("Cloud Spanner hybrid search query failed") if database query fails or returns null.
 */
export async function searchProducts(options: HybridSearchOptions): Promise<HybridSearchResult> {
  const startTime = Date.now();
  const queryText = (options.q || "").trim();
  const limit = options.limit || 20;
  const offset = options.offset || 0;

  if (!queryText) {
    return {
      query: "",
      total_matches: 0,
      execution_time_ms: Date.now() - startTime,
      limit,
      offset,
      products: []
    };
  }

  // Generate 768-dim embedding for query
  const queryEmbedding = await generateTextEmbedding(queryText);

  try {
    // 1. BM25 Search Query against Cloud Spanner
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

    if (bm25Rows === null) {
      throw new Error("Cloud Spanner hybrid search query failed");
    }

    // 2. Vector Cosine Distance KNN Query against Cloud Spanner
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

    if (vectorRows === null) {
      throw new Error("Cloud Spanner hybrid search query failed");
    }

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

    if (candidateIds.length === 0) {
      return {
        query: queryText,
        total_matches: 0,
        execution_time_ms: Date.now() - startTime,
        limit,
        offset,
        products: []
      };
    }

    // Batch query candidate products with IN UNNEST(@product_ids)
    const pSql = `SELECT product_id, category_id, brand, model, name_en, name_zh, price_hkd, description_en, description_zh, acoustic_signature_en, acoustic_signature_zh, image_url, is_active FROM Products WHERE product_id IN UNNEST(@product_ids) AND is_active = true`;
    const pRows = await executeSpannerSql<Product>({ sql: pSql, params: { product_ids: candidateIds } });

    if (pRows === null) {
      throw new Error("Cloud Spanner hybrid search query failed");
    }

    // Batch query specifications for candidate products with IN UNNEST(@product_ids)
    const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id IN UNNEST(@product_ids)`;
    const specRows = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_ids: candidateIds } });

    if (specRows === null) {
      throw new Error("Cloud Spanner hybrid search query failed");
    }

    const specsMap = new Map<string, ProductSpecification[]>();
    for (const spec of specRows) {
      const list = specsMap.get(spec.product_id) || [];
      list.push(spec);
      specsMap.set(spec.product_id, list);
    }

    const productMap = new Map<string, Product>();
    for (const p of pRows) {
      productMap.set(p.product_id, {
        ...p,
        price_hkd: parseSpannerNumeric(p.price_hkd),
        image_url: sanitizeImageUrl(p.image_url),
        specifications: specsMap.get(p.product_id) || []
      });
    }

    // Compute Reciprocal Rank Fusion (RRF) Scores & Filter Candidates
    const scoredProducts: { product: Product; rrf_score: number; bm25_rank: number; vector_rank: number }[] = [];

    for (const pid of candidateIds) {
      const product = productMap.get(pid);
      if (!product) continue;

      const bm25Rank = bm25Ranks.get(pid);
      const vectorRank = vectorRanks.get(pid);

      const bm25ScoreTerm = bm25Rank ? WEIGHT_BM25 / (K_RRF + bm25Rank) : 0;
      const vectorScoreTerm = vectorRank ? WEIGHT_VECTOR / (K_RRF + vectorRank) : 0;
      const rrfScore = bm25ScoreTerm + vectorScoreTerm;

      // Apply Structural Filters
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

    // Sort descending by RRF score
    scoredProducts.sort((a, b) => b.rrf_score - a.rrf_score);

    const paginated = scoredProducts.slice(offset, offset + limit).map(item => ({
      ...localizeProduct(item.product, options.lang),
      rrf_score: Number(item.rrf_score.toFixed(6)),
      bm25_rank: item.bm25_rank,
      vector_rank: item.vector_rank,
    }));

    return {
      query: queryText,
      total_matches: scoredProducts.length,
      execution_time_ms: Date.now() - startTime,
      limit,
      offset,
      products: paginated,
    };
  } catch (err) {
    if (err instanceof Error && err.message === "Cloud Spanner hybrid search query failed") {
      throw err;
    }
    throw new Error("Cloud Spanner hybrid search query failed");
  }
}
