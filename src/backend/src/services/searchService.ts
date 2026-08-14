import { v1 as aiplatform } from "@google-cloud/aiplatform";
import { executeSpannerSql, projectId } from "../config/spanner";
import { Product, ProductSpecification, parseSpannerNumeric, sanitizeImageUrl, localizeProduct } from "./catalogService";

export interface HybridSearchOptions {
  q: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  lang?: string;
  limit?: number;
  offset?: number;
  mode?: 'fts' | 'vector' | 'hybrid';
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
      if (values && values.length > 0) {
        return values.map((v: any) => v.numberValue || 0);
      }
    }
  } catch (err) {
    const location = process.env.GCP_LOCATION || "us-central1";
    const errCode = (err as any)?.code ? ` (code: ${(err as any).code})` : "";
    const errDetails = (err as any)?.details ? ` - Details: ${(err as any).details}` : "";
    console.warn(
      `[Vertex AI Warning] Could not generate embedding via Vertex AI API (model: text-embedding-004, location: ${location}): ` +
      `${(err as Error).message}${errCode}${errDetails}. Using normalized fallback embedding vector.`
    );
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
 * Execute Pure Full-Text Search (FTS) using Cloud Spanner 3-Tier Multi-TokenList Field Weighting.
 * No embedding generation is performed.
 */
export async function searchProductsFtsOnly(options: HybridSearchOptions): Promise<HybridSearchResult> {
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

  try {
    const filterParams: Record<string, any> = { query_text: queryText };
    const filterTypes: Record<string, any> = { query_text: "string" };
    let ftsFilterSql = "";

    if (options.category) {
      ftsFilterSql += " AND LOWER(category_id) = LOWER(@category)";
      filterParams.category = options.category;
      filterTypes.category = "string";
    }

    if (options.min_price !== undefined) {
      ftsFilterSql += " AND price_hkd >= @min_price";
      filterParams.min_price = options.min_price;
      filterTypes.min_price = "float64";
    }

    if (options.max_price !== undefined) {
      ftsFilterSql += " AND price_hkd <= @max_price";
      filterParams.max_price = options.max_price;
      filterTypes.max_price = "float64";
    }

    if (options.brand) {
      ftsFilterSql += " AND LOWER(brand) LIKE @brand_pattern";
      filterParams.brand_pattern = `%${options.brand.toLowerCase()}%`;
      filterTypes.brand_pattern = "string";
    }

    const ftsSql = `
      SELECT product_id, category_id, category_name_en, category_name_zh,
             category_description_en, category_description_zh, brand, model,
             name_en, name_zh, CAST(price_hkd AS FLOAT64) AS price_hkd,
             description_en, description_zh, acoustic_signature_en, acoustic_signature_zh,
             image_url, is_active,
             (
               COALESCE(SCORE(primary_tokens, @query_text), 0.0) * 4.0 +
               COALESCE(SCORE(category_tokens, @query_text), 0.0) * 2.5 +
               COALESCE(SCORE(description_tokens, @query_text), 0.0) * 1.0
             ) AS score
      FROM Products@{FORCE_INDEX=idx_products_search}
      WHERE (
        SEARCH(primary_tokens, @query_text) OR
        SEARCH(category_tokens, @query_text) OR
        SEARCH(description_tokens, @query_text)
      ) AND is_active = true${ftsFilterSql}
      ORDER BY score DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countSql = `
      SELECT COUNT(*) AS count
      FROM Products@{FORCE_INDEX=idx_products_search}
      WHERE (
        SEARCH(primary_tokens, @query_text) OR
        SEARCH(category_tokens, @query_text) OR
        SEARCH(description_tokens, @query_text)
      ) AND is_active = true${ftsFilterSql}
    `;

    const [rows, countRows] = await Promise.all([
      executeSpannerSql<Product & { score?: number }>({
        sql: ftsSql,
        params: filterParams,
        types: filterTypes
      }),
      executeSpannerSql<{ count: number | string }>({
        sql: countSql,
        params: filterParams,
        types: filterTypes
      })
    ]);

    if (rows === null || countRows === null) {
      throw new Error("Cloud Spanner full-text search query failed or database is unreachable");
    }

    const totalMatches = countRows && countRows.length > 0 ? Number(countRows[0].count) : rows.length;

    if (rows.length === 0) {
      return {
        query: queryText,
        total_matches: 0,
        execution_time_ms: Date.now() - startTime,
        limit,
        offset,
        products: []
      };
    }

    // Batch query specifications for products using IN UNNEST(@product_ids)
    const productIds = rows.map(p => p.product_id);
    const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id IN UNNEST(@product_ids)`;
    const specs = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_ids: productIds } }) || [];

    const specsMap = new Map<string, ProductSpecification[]>();
    for (const spec of specs) {
      const list = specsMap.get(spec.product_id) || [];
      list.push(spec);
      specsMap.set(spec.product_id, list);
    }

    const products: Product[] = rows.map((p, idx) => ({
      ...p,
      price_hkd: parseSpannerNumeric(p.price_hkd),
      image_url: sanitizeImageUrl(p.image_url),
      specifications: specsMap.get(p.product_id) || [],
      bm25_rank: offset + idx + 1
    }));

    const localized = products.map(p => localizeProduct(p, options.lang));

    return {
      query: queryText,
      total_matches: totalMatches,
      execution_time_ms: Date.now() - startTime,
      limit,
      offset,
      products: localized
    };
  } catch (error) {
    console.error("[Spanner FTS Search Error] Spanner query execution failed:", error);
    throw error;
  }
}

/**
 * Execute Single Unified Cloud Spanner Hybrid Search (BM25 3-Tier Multi-TokenList + Vector COSINE Distance + RRF Reranking).
 */
export async function searchProducts(options: HybridSearchOptions): Promise<HybridSearchResult> {
  if (options.mode === 'fts') {
    return searchProductsFtsOnly(options);
  }

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

    // 1. Unified Single Spanner SQL Hybrid Query combining BM25 3-Tier Multi-TokenList + Vector Cosine Distance
    const hybridSearchSql = `
      WITH bm25_results AS (
        SELECT product_id,
          (
            COALESCE(SCORE(primary_tokens, @query_text), 0.0) * 4.0 +
            COALESCE(SCORE(category_tokens, @query_text), 0.0) * 2.5 +
            COALESCE(SCORE(description_tokens, @query_text), 0.0) * 1.0
          ) AS weighted_bm25_score
        FROM Products@{FORCE_INDEX=idx_products_search}
        WHERE (
          SEARCH(primary_tokens, @query_text) OR
          SEARCH(category_tokens, @query_text) OR
          SEARCH(description_tokens, @query_text)
        ) AND is_active = true${bm25FilterSql}
        ORDER BY weighted_bm25_score DESC
        LIMIT 50
      ),
      vector_results AS (
        SELECT e.product_id, COSINE_DISTANCE(e.embedding, @query_embedding) AS distance
        FROM ProductEmbeddings e
        JOIN Products p ON e.product_id = p.product_id
        WHERE p.is_active = true${vectorFilterSql}
        ORDER BY distance ASC
        LIMIT 50
      ),
      candidates AS (
        SELECT product_id FROM bm25_results
        UNION DISTINCT
        SELECT product_id FROM vector_results
      )
      SELECT p.product_id, p.category_id, p.category_name_en, p.category_name_zh,
             p.category_description_en, p.category_description_zh, p.brand, p.model,
             p.name_en, p.name_zh, CAST(p.price_hkd AS FLOAT64) AS price_hkd,
             p.description_en, p.description_zh, p.acoustic_signature_en,
             p.acoustic_signature_zh, p.image_url, p.is_active
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
      throw new Error("Cloud Spanner hybrid search query failed or database is unreachable");
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

    // Fetch BM25 index ranks with 3-tier weighting
    const bm25Sql = `
      SELECT product_id,
        (
          COALESCE(SCORE(primary_tokens, @query_text), 0.0) * 4.0 +
          COALESCE(SCORE(category_tokens, @query_text), 0.0) * 2.5 +
          COALESCE(SCORE(description_tokens, @query_text), 0.0) * 1.0
        ) AS weighted_bm25_score
      FROM Products@{FORCE_INDEX=idx_products_search}
      WHERE (
        SEARCH(primary_tokens, @query_text) OR
        SEARCH(category_tokens, @query_text) OR
        SEARCH(description_tokens, @query_text)
      ) AND is_active = true${bm25FilterSql}
      ORDER BY weighted_bm25_score DESC
      LIMIT 50
    `;
    const bm25Rows = await executeSpannerSql<{ product_id: string }>({
      sql: bm25Sql,
      params: { query_text: queryText, ...filterParams },
      types: { query_text: "string", ...filterTypes }
    });

    if (bm25Rows === null) {
      throw new Error("Cloud Spanner BM25 ranking query failed or database is unreachable");
    }

    const bm25Ranks = new Map<string, number>();
    bm25Rows.forEach((r, idx) => bm25Ranks.set(r.product_id, idx + 1));

    // Fetch Vector ranks
    const vecSql = `SELECT e.product_id FROM ProductEmbeddings e JOIN Products p ON e.product_id = p.product_id WHERE p.is_active = true${vectorFilterSql} ORDER BY COSINE_DISTANCE(e.embedding, @query_embedding) ASC LIMIT 50`;
    const vecRows = await executeSpannerSql<{ product_id: string }>({
      sql: vecSql,
      params: { query_embedding: queryEmbedding, ...filterParams },
      types: { query_embedding: { type: "array", child: { type: "float64" } }, ...filterTypes }
    });

    if (vecRows === null) {
      throw new Error("Cloud Spanner vector ranking query failed or database is unreachable");
    }

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
    console.error("[Spanner Hybrid Search Error] Spanner query execution failed:", error);
    throw error;
  }
}
