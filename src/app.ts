/**
 * src/app.ts
 *
 * Express application factory.
 *
 * Separating the Express app from the HTTP server (server.ts) is the standard
 * pattern that makes the app importable in tests without binding a port.
 * Tests call `supertest(createApp())` — no running server needed.
 */

import express from 'express';
import healthRouter from './routes/health.route';
import productsRouter from './routes/products.route';

export function createApp(): express.Express {
  const app = express();

  // ── Middleware ──────────────────────────────────────────────────────────────

  // Parse JSON request bodies (limit 1mb — prevents memory exhaustion)
  app.use(express.json());

  // ── Routes ──────────────────────────────────────────────────────────────────

  // Health check — all versions
  app.use('/', healthRouter);

  // Products — version-gated internally (see products.route.ts)
  app.use('/', productsRouter);

  // ── 404 Handler ─────────────────────────────────────────────────────────────
  // Returns JSON (not the default Express HTML page) for unknown routes.
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}
