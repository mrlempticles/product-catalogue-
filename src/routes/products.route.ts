/**
 * src/routes/products.route.ts
 *
 * Products router — routes conditionally based on APP_VERSION.
 *
 * Version matrix:
 *   v1.0  → GET /products only
 *   v1.1  → GET /products + GET /products/search?keyword=
 *   v2.0  → GET /products + GET /products/search (keyword + category + price)
 *
 * IMPORTANT: APP_VERSION is checked inside a middleware (per-request) rather
 * than at module-load time. This is correct for two reasons:
 *   1. In production: the value never changes after startup, so there's no
 *      functional difference, but reading it per-request is more robust.
 *   2. In tests: Vitest caches modules across describe blocks. If the check
 *      were a top-level `const version = process.env.APP_VERSION`, it would
 *      be frozen at the value present when the module was first imported —
 *      meaning v1.0 tests would break v1.1/v2.0 tests. Reading from process.env
 *      inside the handler avoids this entirely.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { getProducts, searchProducts } from '../controllers/products.controller';

const router = Router();

// ── GET /products — all versions ──────────────────────────────────────────────
router.get('/products', getProducts);

// ── GET /products/search — v1.1 and v2.0 only ────────────────────────────────
//
// The route is always registered, but the middleware below gates it by version.
// This means v1.0 callers get a proper 404 from the next handler (the 404
// catch-all in app.ts) instead of a cryptic "route not found" from Express
// trying to match a non-existent route.
//
// Alternatively we could register the route conditionally (if version === ...),
// but that would freeze the check at module-load time — see the note above.
router.get(
  '/products/search',
  // Version gate middleware — runs before the controller
  (req: Request, res: Response, next: NextFunction): void => {
    const version = process.env.APP_VERSION ?? 'v1.0';
    if (version === 'v1.1' || version === 'v2.0') {
      next(); // Proceed to searchProducts controller
    } else {
      // v1.0: this route is not part of the API — return 404
      res.status(404).json({ error: 'Route not found' });
    }
  },
  searchProducts
);

export default router;
