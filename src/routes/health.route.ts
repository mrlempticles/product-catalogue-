/**
 * src/routes/health.route.ts
 *
 * Health-check endpoint — mounted in all versions (v1.0, v1.1, v2.0).
 *
 * GET /health → { "status": "ok", "version": "v1.0" }
 *
 * The version comes from the APP_VERSION env var, which is set differently
 * per deployment (see k8s/<version>/deployment.yaml). This lets the hiring
 * team confirm which version is running just by hitting /health.
 *
 * Used by:
 *   - Docker HEALTHCHECK
 *   - Kubernetes liveness/readiness probes (if added later)
 *   - CI integration-test job (curl /health)
 */

import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: process.env.APP_VERSION ?? 'v1.0',
  });
});

export default router;
