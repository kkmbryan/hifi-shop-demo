-- =============================================================================
-- Hi-Fi Shop Demo Platform - Cloud Spanner DDL Schema
-- Script 02: Index Creation DDL
-- File: sql/02_create_indexes.sql
-- Description: Creates relational secondary covering indexes for Cloud Spanner.
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
-- 2. Cloud Spanner Full-Text Search Index
-- Multi-tokenized index on generated primary, category, and description token columns for BM25 tiered search.
-- -----------------------------------------------------------------------------
CREATE SEARCH INDEX idx_products_search ON Products (
  primary_tokens,
  category_tokens,
  description_tokens
) STORING (
  category_id,
  category_name_en,
  category_name_zh,
  brand,
  model,
  name_en,
  name_zh,
  price_hkd,
  image_url,
  is_active
);
