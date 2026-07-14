/**
 * src/controllers/products.controller.ts
 *
 * Request handlers for the /products endpoints.
 *
 * Version behaviour is gated by the APP_VERSION env var read at request time
 * (not at startup) so that the value is always current without a restart.
 *
 *   v1.0 — GET /products only
 *   v1.1 — adds GET /products/search?keyword=<str>
 *   v2.0 — search also accepts category, minPrice, maxPrice (AND-combined)
 *           returns 400 if minPrice/maxPrice aren't valid finite numbers
 */

import { Request, Response } from 'express';
import { products, Product } from '../data/products.data';

// ── GET /products ─────────────────────────────────────────────────────────────

/**
 * Returns the full static product list.
 * Available in all versions (v1.0, v1.1, v2.0).
 */
export function getProducts(_req: Request, res: Response): void {
  res.json(products);
}

// ── GET /products/search ──────────────────────────────────────────────────────

/**
 * Returns a filtered subset of products.
 *
 * Query params (all optional):
 *   keyword   — case-insensitive substring match against product name
 *   category  — exact match against product category (v2.0 only)
 *   minPrice  — lower bound inclusive (v2.0 only); must be a valid number if provided
 *   maxPrice  — upper bound inclusive (v2.0 only); must be a valid number if provided
 *
 * Filters are AND-combined: a product must satisfy every provided filter to appear.
 * Returns [] if nothing matches — this is not an error.
 *
 * Available in v1.1+ only; the route is never mounted in v1.0.
 */
export function searchProducts(req: Request, res: Response): void {
  const version = process.env.APP_VERSION ?? 'v1.0';

  const { keyword, category, minPrice, maxPrice } = req.query as Record<string, string | undefined>;

  // ── v2.0: validate numeric params ────────────────────────────────────────
  // Only parse minPrice/maxPrice in v2.0; the v1.1 route ignores them even if
  // someone passes them, which is the simplest correct behaviour.
  let parsedMin: number | undefined;
  let parsedMax: number | undefined;

  if (version === 'v2.0') {
    if (minPrice !== undefined) {
      parsedMin = parseFloat(minPrice);
      if (!isFinite(parsedMin)) {
        res.status(400).json({
          error: 'Invalid query parameter',
          detail: `minPrice must be a valid number, got: "${minPrice}"`,
        });
        return;
      }
    }

    if (maxPrice !== undefined) {
      parsedMax = parseFloat(maxPrice);
      if (!isFinite(parsedMax)) {
        res.status(400).json({
          error: 'Invalid query parameter',
          detail: `maxPrice must be a valid number, got: "${maxPrice}"`,
        });
        return;
      }
    }
  }

  // ── Apply filters ─────────────────────────────────────────────────────────
  let results: Product[] = products;

  // keyword: case-insensitive substring match against product name
  if (keyword) {
    const lower = keyword.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(lower));
  }

  // category / minPrice / maxPrice: v2.0 only
  if (version === 'v2.0') {
    if (category) {
      // Exact match (case-insensitive for ergonomics)
      const lowerCat = category.toLowerCase();
      results = results.filter((p) => p.category.toLowerCase() === lowerCat);
    }

    if (parsedMin !== undefined) {
      results = results.filter((p) => p.price >= parsedMin!);
    }

    if (parsedMax !== undefined) {
      results = results.filter((p) => p.price <= parsedMax!);
    }
  }

  res.json(results);
}
