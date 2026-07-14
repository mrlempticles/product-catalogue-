# Changelog

All notable changes to the product-catalogue-service are documented here.
Dates use ISO 8601 format (YYYY-MM-DD). Tags use semantic versioning.

---

## [v2.0.0] - 2026-07-14

### Added
- `GET /products/search` now accepts additional optional query parameters:
  - `category` -- exact match (case-insensitive) against product category
  - `minPrice` -- lower price bound (inclusive)
  - `maxPrice` -- upper price bound (inclusive)
- Multiple filters are AND-combined: all provided filters must match for a product to be returned
- Input validation for `minPrice` and `maxPrice`: non-numeric values now return `400 Bad Request` with a clear JSON error message (`{ "error": "...", "detail": "..." }`) instead of silently ignoring the invalid input or crashing
- `APP_VERSION=v2.0` activates the full search feature set

### Kubernetes
- Added `k8s/v2/` namespace manifests (Deployment, Service, HPA) for `catalogue-v2` namespace
- Ingress updated with `/v2(/|$)(.*)` path rule routing to `catalogue-v2-ext` ExternalName Service

---

## [v1.1.0] - 2026-07-14

### Added
- `GET /products/search?keyword=<str>` endpoint
  - Case-insensitive substring match against product name
  - Returns `[]` if no products match (not a 404 or error)
  - Available in `APP_VERSION=v1.1` (and v2.0 as a superset)

### Kubernetes
- Added `k8s/v1-1/` namespace manifests (Deployment, Service, HPA) for `catalogue-v1-1` namespace
- Ingress updated with `/v1.1(/|$)(.*)` path rule routing to `catalogue-v1-1-ext` ExternalName Service

---

## [v1.0.0] - 2026-07-14

### Added
- Initial release of the product-catalogue-service
- `GET /health` -- returns `{ "status": "ok", "version": "v1.0" }` (version is runtime-configured)
- `GET /products` -- returns the full static product catalogue (18 products across 5 categories: Electronics, Books, Clothing, Home & Kitchen, Sports)
- Single multi-stage Dockerfile (`node:20-slim`) with non-root user, HEALTHCHECK via wget
- `APP_VERSION` environment variable controls which API version is active at runtime
- Kubernetes manifests for `catalogue-v1` namespace: Deployment (2 replicas), ClusterIP Service, HPA (min 2 / max 5 / 50% CPU)
- Ingress with ExternalName Services for cross-namespace path routing (`/v1`, `/v1.1`, `/v2`)
- GitHub Actions CI/CD pipeline: test -> build+push -> integration-test -> dry-run-deploy
- Git tags `v1.0.0`, `v1.1.0`, `v2.0.0` applied to track version history
