import { executeSpannerSql } from "../config/spanner";

export interface Category {
  category_id: string;
  name_en: string;
  name_zh: string;
  name?: string;
  slug: string;
  description_en: string;
  description_zh: string;
  description?: string;
  display_order: number;
}

export interface ProductSpecification {
  product_id: string;
  spec_key: string;
  spec_value_en: string;
  spec_value_zh: string;
  spec_value?: string;
  is_filter_facet: boolean;
}

export interface Product {
  product_id: string;
  category_id: string;
  brand: string;
  model: string;
  name_en: string;
  name_zh: string;
  name?: string;
  price_hkd: number;
  description_en: string;
  description_zh: string;
  description?: string;
  acoustic_signature_en: string;
  acoustic_signature_zh: string;
  acoustic_signature?: string;
  image_url: string;
  is_active: boolean;
  specifications?: ProductSpecification[];
  rrf_score?: number;
  bm25_rank?: number;
  vector_rank?: number;
}

export interface ProductQueryOptions {
  category_id?: string;
  brand?: string | string[];
  min_price?: number;
  max_price?: number;
  output_ports?: string | string[];
  spec_key?: string;
  spec_value?: string;
  lang?: string;
  limit?: number;
  offset?: number;
}

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

function isChinese(lang?: string): boolean {
  if (!lang) return false;
  const l = lang.toLowerCase();
  return l.includes("zh") || l.includes("hk") || l.includes("cn");
}

export function localizeCategory(category: Category, lang?: string): Category {
  const zh = isChinese(lang);
  return {
    ...category,
    name: zh ? category.name_zh : category.name_en,
    description: zh ? category.description_zh : category.description_en,
  };
}

export function localizeProduct(product: Product, lang?: string): Product {
  const zh = isChinese(lang);
  return {
    ...product,
    name: zh ? product.name_zh : product.name_en,
    description: zh ? product.description_zh : product.description_en,
    acoustic_signature: zh ? product.acoustic_signature_zh : product.acoustic_signature_en,
    specifications: product.specifications?.map(s => ({
      ...s,
      spec_value: zh ? s.spec_value_zh : s.spec_value_en,
    }))
  };
}

/**
 * Retrieve category taxonomy strictly from Cloud Spanner.
 */
export async function getCategories(lang?: string): Promise<Category[]> {
  const sql = `SELECT category_id, name_en, name_zh, slug, description_en, description_zh, display_order FROM Categories ORDER BY display_order ASC`;
  const dbRows = await executeSpannerSql<Category>(sql);

  if (dbRows === null) {
    throw new Error("Cloud Spanner database query failed or database is unreachable");
  }

  return dbRows.map(cat => localizeCategory(cat, lang));
}

/**
 * Query products strictly from Cloud Spanner with multi-faceted hardware filters.
 */
export async function getProducts(options: ProductQueryOptions = {}): Promise<{
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}> {
  const limit = options.limit || 20;
  const offset = options.offset || 0;

  const conditions: string[] = ["is_active = true"];
  const params: Record<string, any> = {};

  if (options.category_id) {
    conditions.push("LOWER(category_id) = LOWER(@category_id)");
    params.category_id = options.category_id;
  }

  if (options.brand) {
    if (Array.isArray(options.brand)) {
      conditions.push("LOWER(brand) IN UNNEST(@brands)");
      params.brands = options.brand.map(b => b.toLowerCase());
    } else {
      conditions.push("LOWER(brand) LIKE @brand");
      params.brand = `%${options.brand.toLowerCase()}%`;
    }
  }

  if (options.min_price !== undefined) {
    conditions.push("price_hkd >= @min_price");
    params.min_price = options.min_price;
  }

  if (options.max_price !== undefined) {
    conditions.push("price_hkd <= @max_price");
    params.max_price = options.max_price;
  }

  const whereClause = conditions.join(" AND ");

  const countSql = `SELECT COUNT(*) AS count FROM Products WHERE ${whereClause}`;
  const countRows = await executeSpannerSql<{ count: number | string }>({ sql: countSql, params });
  if (countRows === null) {
    throw new Error("Cloud Spanner database query failed or database is unreachable");
  }
  const total = countRows.length > 0 ? Number(countRows[0].count) : 0;

  const sql = `
    SELECT product_id, category_id, brand, model, name_en, name_zh, CAST(price_hkd AS FLOAT64) AS price_hkd,
           description_en, description_zh, acoustic_signature_en, acoustic_signature_zh,
           image_url, is_active
    FROM Products
    WHERE ${whereClause}
    ORDER BY price_hkd ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const rows = await executeSpannerSql<Product>({ sql, params });
  if (rows === null) {
    throw new Error("Cloud Spanner database query failed or database is unreachable");
  }

  if (rows.length === 0) {
    return {
      products: [],
      total,
      limit,
      offset
    };
  }

  // Batch query specifications for products using IN UNNEST(@product_ids)
  const productIds = rows.map(p => p.product_id);
  const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id IN UNNEST(@product_ids)`;
  const specs = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_ids: productIds } });
  if (specs === null) {
    throw new Error("Cloud Spanner database query failed or database is unreachable");
  }

  const specsMap = new Map<string, ProductSpecification[]>();
  for (const spec of specs) {
    const list = specsMap.get(spec.product_id) || [];
    list.push(spec);
    specsMap.set(spec.product_id, list);
  }

  let products: Product[] = rows.map(p => ({
    ...p,
    price_hkd: parseSpannerNumeric(p.price_hkd),
    image_url: sanitizeImageUrl(p.image_url),
    specifications: specsMap.get(p.product_id) || []
  }));

  if (options.output_ports) {
    const ports = Array.isArray(options.output_ports) ? options.output_ports : [options.output_ports];
    products = products.filter(p => {
      if (!p.specifications) return false;
      return p.specifications.some(spec => {
        if (spec.spec_key === "output_interface" || spec.spec_key === "input_interface" || spec.spec_key === "connector") {
          return ports.some(port =>
            spec.spec_value_en.toLowerCase().includes(port.toLowerCase()) ||
            spec.spec_value_zh.toLowerCase().includes(port.toLowerCase())
          );
        }
        return false;
      });
    });
  }

  const localized = products.map(p => localizeProduct(p, options.lang));

  return {
    products: localized,
    total,
    limit,
    offset
  };
}

/**
 * Get product by ID strictly from Cloud Spanner with full specs.
 */
export async function getProductById(productId: string, lang?: string): Promise<Product | null> {
  const sql = `SELECT product_id, category_id, brand, model, name_en, name_zh, CAST(price_hkd AS FLOAT64) AS price_hkd, description_en, description_zh, acoustic_signature_en, acoustic_signature_zh, image_url, is_active FROM Products WHERE product_id = @product_id AND is_active = true`;
  const rows = await executeSpannerSql<Product>({ sql, params: { product_id: productId } });

  if (rows === null) {
    throw new Error("Cloud Spanner database query failed or database is unreachable");
  }

  if (rows.length === 0) {
    return null;
  }

  const product: Product = {
    ...rows[0],
    price_hkd: parseSpannerNumeric(rows[0].price_hkd),
    image_url: sanitizeImageUrl(rows[0].image_url)
  };

  const specsSql = `SELECT product_id, spec_key, spec_value_en, spec_value_zh, is_filter_facet FROM ProductSpecifications WHERE product_id = @product_id`;
  const specs = await executeSpannerSql<ProductSpecification>({ sql: specsSql, params: { product_id: productId } });

  if (specs === null) {
    throw new Error("Cloud Spanner database query failed or database is unreachable");
  }

  product.specifications = specs;
  return localizeProduct(product, lang);
}

/**
 * Get faceted filter options for catalog UI strictly from Cloud Spanner queries.
 */
export async function getFacetedFilters(categoryId?: string): Promise<{
  brands: string[];
  output_ports: string[];
  price_range: { min: number; max: number };
}> {
  const result = await getProducts({ category_id: categoryId, limit: 1000 });
  const products = result.products;

  const brands = Array.from(new Set(products.map(p => p.brand))).sort();

  const portsSet = new Set<string>();
  const commonPorts = ["Balanced XLR", "I2S", "RCA", "4.4mm Balanced", "6.35mm", "Optical", "AES/EBU", "USB"];

  products.forEach(p => {
    p.specifications?.forEach(spec => {
      commonPorts.forEach(port => {
        if (spec.spec_value_en.toLowerCase().includes(port.toLowerCase())) {
          portsSet.add(port);
        }
      });
    });
  });

  const prices = products.map(p => p.price_hkd);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 200000;

  return {
    brands,
    output_ports: Array.from(portsSet),
    price_range: {
      min: minPrice,
      max: maxPrice
    }
  };
}
