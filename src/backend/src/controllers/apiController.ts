import { Request, Response, NextFunction } from 'express';
import { getCategories, getProducts, getProductById, getFacetedFilters } from '../services/catalogService';
import { searchProducts } from '../services/searchService';
import { evaluateSynergy } from '../services/synergyService';
import { checkSpannerStatus } from '../config/spanner';

/**
 * Helper to safely parse numeric query parameters (e.g. min_price, max_price, limit, offset).
 * Prevents NaN issues by returning defaultValue or undefined if parsing fails.
 */
export function parseNumericParam(value: unknown): number | undefined;
export function parseNumericParam(value: unknown, defaultValue: number): number;
export function parseNumericParam(value: unknown, defaultValue?: number): number | undefined {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const strVal = Array.isArray(value) ? String(value[0]) : String(value);
  const parsed = Number(strVal);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

/**
 * GET /api/v1/categories
 * Taxonomy category listing with localization support ('en-US' or 'zh-HK').
 */
export async function handleGetCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    const lang = (req.query.lang as string) || (req.query.locale as string) || 'en-US';
    const categories = await getCategories(lang);
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/products
 * Faceted product catalog listing with budget filters, brand filters, and hardware specifications.
 */
export async function handleGetProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    const lang = (req.query.lang as string) || (req.query.locale as string) || 'en-US';
    const category_id = req.query.category_id as string || req.query.category as string;
    const brand = req.query.brand as string;
    const min_price = parseNumericParam(req.query.min_price);
    const max_price = parseNumericParam(req.query.max_price);
    const output_ports = req.query.output_ports as string;
    const limit = parseNumericParam(req.query.limit, 20);
    const offset = parseNumericParam(req.query.offset, 0);

    const result = await getProducts({
      category_id,
      brand,
      min_price,
      max_price,
      output_ports,
      lang,
      limit,
      offset
    });

    const facets = await getFacetedFilters(category_id);

    res.status(200).json({
      status: 'success',
      data: {
        products: result.products,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
        },
        facets
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/products/:id
 * Single product detail view with full specifications.
 */
export async function handleGetProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    const productId = req.params.id;
    const lang = (req.query.lang as string) || (req.query.locale as string) || 'en-US';

    if (!productId) {
      res.status(400).json({
        status: 'error',
        message: 'Product ID is required.'
      });
      return;
    }

    const product = await getProductById(productId, lang);
    if (!product) {
      res.status(404).json({
        status: 'error',
        message: `Product with ID '${productId}' was not found.`
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/search
 * Cloud Spanner Hybrid Search (BM25 Keyword + 768-dim Vector Cosine Distance KNN via RRF Score Fusion).
 */
export async function handleSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    const q = ((req.query.q as string) || (req.query.query as string) || (req.query.search as string) || '').trim();
    const category = req.query.category as string;
    const brand = req.query.brand as string;
    const min_price = parseNumericParam(req.query.min_price);
    const max_price = parseNumericParam(req.query.max_price);
    const lang = (req.query.lang as string) || (req.query.locale as string) || 'en-US';
    const limit = parseNumericParam(req.query.limit, 20);
    const offset = parseNumericParam(req.query.offset, 0);

    const searchResult = await searchProducts({
      q,
      category,
      brand,
      min_price,
      max_price,
      lang,
      limit,
      offset
    });

    res.status(200).json({
      status: 'success',
      data: searchResult
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/synergy/check
 * Audio Component Synergy Engine evaluating tube amp gain staging, output impedance ratios, and headphone sensitivity thresholds.
 */
export async function handleSynergyCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    const body = req.body || {};
    const product_ids = body.product_ids || body.cart_items;
    const lang = body.lang || (req.query.lang as string) || 'en-US';

    if (!product_ids || !Array.isArray(product_ids)) {
      res.status(400).json({
        status: 'error',
        message: "Invalid request payload. 'product_ids' or 'cart_items' must be a valid array of product IDs."
      });
      return;
    }

    const synergyResult = await evaluateSynergy({
      product_ids,
      cart_items: product_ids,
      lang
    });

    res.status(200).json({
      status: 'success',
      data: synergyResult
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/health
 * Microservice health check endpoint.
 */
export async function handleHealthCheck(_req: Request, res: Response): Promise<void> {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  const spannerStatus = checkSpannerStatus();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'hifi-shop-backend',
    version: '1.0.0',
    currency: 'HKD',
    spanner: spannerStatus
  });
}
