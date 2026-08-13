-- =============================================================================
-- Hi-Fi Shop Demo Platform - Cloud Spanner DDL Schema
-- Script 02: Index Creation DDL
-- File: sql/02_create_indexes.sql
-- Description: Creates relational secondary indexes, BM25 N-gram Full-Text Search
--              Index, and 768-dimensional Vector Cosine Distance Index in Cloud Spanner.
-- Target DB: Google Cloud Spanner (GoogleSQL Dialect)
-- Author: Database Architect
-- Date: August 13, 2026
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Relational Secondary Composite & Covering Indexes
-- Optimized for high-throughput category listing, budget range filtering,
-- and hardware spec facet filtering.
-- -----------------------------------------------------------------------------

-- Index for category browsing with price ordering and covering stored columns
CREATE INDEX idx_products_category_price ON Products (
  category_id,
  price_hkd ASC
) STORING (
  brand,
  model,
  name_en,
  name_zh,
  image_url,
  is_active
);

-- Index for active product catalog filtering
CREATE INDEX idx_products_active_category ON Products (
  is_active,
  category_id
) STORING (
  brand,
  model,
  price_hkd
);

-- Secondary Index on Interleaved ProductSpecifications table for hardware facet queries
CREATE INDEX idx_specs_key_facet ON ProductSpecifications (
  spec_key,
  is_filter_facet
) STORING (
  spec_value_en,
  spec_value_zh
);

-- -----------------------------------------------------------------------------
-- 2. BM25 N-Gram Full-Text Search Index
-- Enables multi-language full-text search across English (en-US) full-text tokens
-- and Traditional Chinese (zh-HK) N-gram tokens (min=1, max=3).
-- Includes STORING clause to prevent back-joins to primary table.
-- -----------------------------------------------------------------------------
CREATE SEARCH INDEX idx_products_bm25_search ON Products (
  TOKENIZE_FULLTEXT(name_en),
  TOKENIZE_FULLTEXT(brand),
  TOKENIZE_FULLTEXT(model),
  TOKENIZE_FULLTEXT(acoustic_signature_en),
  TOKENIZE_FULLTEXT(description_en),
  TOKENIZE_NGRAMS(name_zh, ngram_size_min=>1, ngram_size_max=>3),
  TOKENIZE_NGRAMS(acoustic_signature_zh, ngram_size_min=>1, ngram_size_max=>3),
  TOKENIZE_NGRAMS(description_zh, ngram_size_min=>1, ngram_size_max=>3)
) STORING (
  category_id,
  price_hkd,
  image_url,
  is_active
);

-- -----------------------------------------------------------------------------
-- 3. 768-Dimensional Vector Cosine Distance Index
-- Enables high-performance Approximate Nearest Neighbor (ANN) vector similarity
-- search using cosine distance for subjective acoustic query matching.
-- Uses Vertex AI text-embedding-004 vector dimensions (768).
-- -----------------------------------------------------------------------------
CREATE VECTOR INDEX idx_product_embeddings_cosine ON ProductEmbeddings (
  embedding OPTIONS (distance_type = 'COSINE')
) STORING (
  embedding_provider,
  embedding_dimensions,
  updated_at
);
