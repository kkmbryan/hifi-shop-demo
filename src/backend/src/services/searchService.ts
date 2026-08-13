import { v1 as aiplatform } from "@google-cloud/aiplatform";
import { executeSpannerSql, projectId } from "../config/spanner";
import { Product, ProductSpecification, parseSpannerNumeric, sanitizeImageUrl, localizeProduct, getProducts } from "./catalogService";

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
      if (values) {
        return values.map((v: any) => v.numberValue || 0);
      }
    }
  } catch (err) {
    console.warn("[Vertex AI Warning] Could not generate embedding via Vertex AI API, using normalized fallback embedding vector:", (err as Error).message);
  }

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

  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map(v => v / (norm || 1));
}

/**
 * Fallback in-memory catalog search when Cloud Spanner is unavailable or query fails.
 */
async function executeFallbackCatalogSearch(
  options: HybridSearchOptions,
  queryText: string,
  startTime: number
): Promise<HybridSearchResult> {
  const limit = options.limit || 20;
  const offset = options.offset || 0;

  let allProducts: Product[] = [];
  try {
    const catalogResult = await getProducts({
      category_id: options.category,
      min_price: options.min_price,
      max_price: options.max_price,
      brand: options.brand,
      limit: 1000
    });
    allProducts = catalogResult.products;
  } catch (err) {
    console.warn("[Fallback Search Warning] Catalog service query failed:", (err as Error).message);
  }

  const qLower = queryText.toLowerCase();
  const searchTerms = qLower.split(/\s+/).filter(Boolean);

  const matched = allProducts.filter(p => {
    if (options.category && p.category_id.toLowerCase() !== options.category.toLowerCase()) return false;
    if (options.min_price !== undefined && p.price_hkd < options.min_price) return false;
    if (options.max_price !== undefined && p.price_hkd > options.max_price) return false;
    if (options.brand && !p.brand.toLowerCase().includes(options.brand.toLowerCase())) return false;

    if (!qLower) return true;

    const searchableText = [
      p.name_en,
      p.name_zh,
      p.brand,
      p.model,
      p.description_en,
      p.description_zh,
      p.acoustic_signature_en,
      p.acoustic_signature_zh,
      p.category_id
    ].filter(Boolean).join(" ").toLowerCase();

    return searchTerms.some(term => searchableText.includes(term));
  });

  const scored = matched.map((p, idx) => {
    const bm25Rank = idx + 1;
    const vectorRank = idx + 1;
    const bm25Term = WEIGHT_BM25 / (K_RRF + bm25Rank);
    const vectorTerm = WEIGHT_VECTOR / (K_RRF + vectorRank);
    const rrfScore = bm25Term + vectorTerm;

    return {
      ...localizeProduct(p, options.lang),
      rrf_score: rrfScore,
      bm25_rank: bm25Rank,
      vector_rank: vectorRank
    };
  });

  const paginated = scored.slice(offset, offset + limit);

  return {
    query: queryText,
    total_matches: scored.length,
    execution_time_ms: Date.now() - startTime,
    limit,
    offset,
    products: paginated
  };
}

/**
 * Execute Single Unified Cloud Spanner Hybrid Search (BM25 Search Index + Vector COSINE Distance + RRF Reranking).
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

  const queryEmbedding = await generateTextEmbedding(queryText);

  try {
    const filterParams: Record<string, any> = {};
    const filterTypes: Record<string, any> = {};
    let bm25FilterSql = "";
    let vectorFilterSql = "";

    if (options.category) {
      bm25FilterSql += " AND LOWER(category_id) = LOWER(@category)";
      vectorFilterSql += " AND LOWER(p.category_id) = LOWER(@category)";
      filterParams.category = options.category;
      filterTypes.category = "string";
    }

    if (options.min_price !== undefined) {
      bm25FilterSql += " AND price_hkd >= @min_price";
      vectorFilterSql += " AND p.price_hkd >= @min_price";
      filterParams.min_price = options.min_price;
      filterTypes.min_price = "float64";
    }

    if (options.max_price !== undefined) {
      bm25FilterSql += " AND price_hkd <= @max_price";
      vectorFilterSql += " AND p.price_hkd <= @max_price";
      filterParams.max_price = options.max_price;
      filterTypes.max_price = "float64";
    }

    if (options.brand) {
      bm25FilterSql += " AND LOWER(brand) LIKE @brand_pattern";
      vectorFilterSql += " AND LOWER(p.brand) LIKE @brand_pattern";
      filterParams.brand_pattern = `%${options.brand.toLowerCase()}%`;
      filterTypes.brand_pattern = "string";
    }

    // 1. Unified Single Spanner SQL Hybrid Query combining BM25 Search Index + Vector Cosine Distance
    const hybridSearchSql = `
      WITH bm25_results AS (
        SELECT product_id
        FROM Products@{FORCE_INDEX=idx_products_search}
        WHERE SEARCH(search_tokens, @query_text) AND is_active = true${bm25FilterSql}
        LIMIT 50
      ),
      vector_results AS (
        SELECT e.product_id, COSINE_DISTANCE(e.embedding, @query_embedding) AS distance
        FROM ProductEmbeddings e
        JOIN Products p ON e.product_id = p.product_id
        WHERE p.is_active = true AND COSINE_DISTANCE(e.embedding, @query_embedding) <= 0.65${vectorFilterSql}
        ORDER BY distance ASC
        LIMIT 50
      ),
      candidates AS (
        SELECT product_id FROM bm25_results
        UNION DISTINCT
        SELECT product_id FROM vector_results
      )
      SELECT p.product_id, p.category_id, p.brand, p.model, p.name_en, p.name_zh,
             CAST(p.price_hkd AS FLOAT64) AS price_hkd, p.description_en, p.description_zh,
             p.acoustic_signature_en, p.acoustic_signature_zh, p.image_url, p.is_active
      FROM candidates c
      JOIN Products p ON c.product_id = p.product_id
      WHERE p.is_active = true;
    `;

    const candidateRows = await executeSpannerSql<Product>({
      sql: hybridSearchSql,
      params: {
        query_text: queryText,
        query_embedding: queryEmbedding,
        ...filterParams
      },
      types: {
        query_text: "string",
        query_embedding: { type: "array", child: { type: "float64" } },
        ...filterTypes
      }
    });

    if (candidateRows === null) {
      return await executeFallbackCatalogSearch(options, queryText, startTime);
    }

    if (candidateRows.length === 0) {
      return {
        query: queryText,
        total_matches: 0,
        execution_time_ms: Date.now() - startTime,
        limit,
        offset,
        products: []
      };
    }

    // Determine candidate IDs for batch fetching specs
    const candidateIds = candidateRows.map(p => p.product_id);

    // Fetch BM25 index ranks
    const bm25Sql = `SELECT product_id FROM Products@{FORCE_INDEX=idx_products_search} WHERE SEARCH(search_tokens, @query_text) AND is_active = true${bm25FilterSql} LIMIT 50`;
    const bm25Rows = await executeSpannerSql<{ product_id: string }>({
      sql: bm25Sql,
      params: { query_text: queryText, ...filterParams },
      types: { query_text: "string", ...filterTypes }
    }) || [];
    const bm25Ranks = new Map<string, number>();
    bm25Rows.forEach((r, idx) => bm25Ranks.set(r.product_id, idx + 1));

    // Fetch Vector ranks
    const vecSql = `SELECT e.product_id FROM ProductEmbeddings e JOIN Products p ON e.product_id = p.product_id WHERE p.is_active = true AND COSINE_DISTANCE(e.embedding, @query_embedding) <= 0.65${vectorFilterSql} ORDER BY COSINE_DISTANCE(e.embedding, @query_embedding) ASC LIMIT 50`;
    const vecRows = await executeSpannerSql<{ product_id: string }>({
      sql: vecSql,
      params: { query_embedding: queryEmbedding, ...filterParams },
      types: { query_embedding: { type: "array", child: { type: "float64" } }, ...filterTypes }
    }) || [];
    const vecRanks = new Map<string, number>();
    vecRows.forEach((r, idx) => vecRanks.set(r.product_id, idx + 1));

    // Fetch specifications for candidate products
    const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id IN UNNEST(@product_ids)`;
    const specRows = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_ids: candidateIds } }) || [];

    const specsMap = new Map<string, ProductSpecification[]>();
    for (const spec of specRows) {
      const list = specsMap.get(spec.product_id) || [];
      list.push(spec);
      specsMap.set(spec.product_id, list);
    }

    const scoredProducts: { product: Product; rrf_score: number; bm25_rank: number; vector_rank: number }[] = [];

    for (const p of candidateRows) {
      const pid = p.product_id;
      const bm25Rank = bm25Ranks.get(pid);
      const vectorRank = vecRanks.get(pid);

      const bm25ScoreTerm = bm25Rank ? WEIGHT_BM25 / (K_RRF + bm25Rank) : 0;
      const vectorScoreTerm = vectorRank ? WEIGHT_VECTOR / (K_RRF + vectorRank) : 0;
      const rrfScore = bm25ScoreTerm + vectorScoreTerm;

      // Filter out candidate products whose RRF score is low or when BM25 score is 0 and vector distance exceeds relevance threshold
      if (rrfScore < 0.003) continue;
      if (!bm25Rank && (!vectorRank || vectorRank > 30)) continue;

      const fullProduct: Product = {
        ...p,
        price_hkd: parseSpannerNumeric(p.price_hkd),
        image_url: sanitizeImageUrl(p.image_url),
        specifications: specsMap.get(pid) || []
      };

      // Filter options
      if (options.category && fullProduct.category_id.toLowerCase() !== options.category.toLowerCase()) continue;
      if (options.min_price !== undefined && fullProduct.price_hkd < options.min_price) continue;
      if (options.max_price !== undefined && fullProduct.price_hkd > options.max_price) continue;
      if (options.brand && !fullProduct.brand.toLowerCase().includes(options.brand.toLowerCase())) continue;

      scoredProducts.push({
        product: fullProduct,
        rrf_score: rrfScore,
        bm25_rank: bm25Rank || 999,
        vector_rank: vectorRank || 999
      });
    }

    // Sort by RRF score descending
    scoredProducts.sort((a, b) => b.rrf_score - a.rrf_score);

    const paginated = scoredProducts.slice(offset, offset + limit).map(item => ({
      ...localizeProduct(item.product, options.lang),
      rrf_score: item.rrf_score,
      bm25_rank: item.bm25_rank,
      vector_rank: item.vector_rank
    }));

    return {
      query: queryText,
      total_matches: scoredProducts.length,
      execution_time_ms: Date.now() - startTime,
      limit,
      offset,
      products: paginated
    };
  } catch (error) {
    console.warn("[Spanner Hybrid Search Warning] Spanner query execution failed, falling back to catalog search:", error);
    return await executeFallbackCatalogSearch(options, queryText, startTime);
  }
}
