# System Design - Product Catalogue Service

This document explains the key architectural decisions made in this service. Each choice has a specific reason rooted in simplicity, correctness, and suitability for the assignment context.

---

## 1. Single Codebase + `APP_VERSION` Env Var (instead of three branches)

**Decision:** All three API versions live in one codebase. The `APP_VERSION` environment variable (`v1.0`, `v1.1`, `v2.0`) gates behaviour at startup (route mounting) and at request time (search parameter handling).

**Rationale:**

The three versions are *additive*: v1.1 is v1.0 plus keyword search; v2.0 is v1.1 plus richer search filters. There is no diverging logic -- no feature that exists in v1.0 but not v2.0.

Maintaining three separate branches would mean:
- Three separate `npm ci` / `docker build` / push cycles in CI
- Merging bug fixes into three places
- Three images to scan, update, and secure

A single image with a runtime config switch is simpler, easier to audit, and still satisfies "three deployable versions" -- each K8s Deployment is a real, distinct artifact with distinct behaviour. The env var is the version selector, not a shortcut around the requirement.

Git tags (`v1.0.0`, `v1.1.0`, `v2.0.0`) are applied to preserve the version history requirement: the tag marks the commit at which each version's feature set was complete.

---

## 2. `node:20-slim` over Alpine

**Decision:** Both build and runtime stages use `node:20-slim` (Debian-based), not `node:20-alpine`.

**Rationale:**

Alpine uses `musl libc` instead of `glibc`. Most Linux binaries (and many npm packages with native addons) are compiled against glibc and require compatibility shims to run on musl -- or fail silently. We encountered exactly this issue previously with the identity-reconciliation service.

`slim` is:
- Debian-based (glibc, standard behaviour)
- Small enough (~200MB, vs ~120MB Alpine, vs ~900MB full) for this use case
- Compatible with `apt-get` for adding `wget` (required for HEALTHCHECK)

The marginal size difference between slim and Alpine is not worth the musl compatibility risk for a service that may grow to include native modules.

---

## 3. HPA Configuration (min 2 / max 5 / 50% CPU)

**Decision:** The HorizontalPodAutoscaler targets 50% average CPU utilization, with a minimum of 2 replicas and a maximum of 5.

**Rationale:**

- **min: 2** -- Ensures the service remains available if one pod is evicted, crashes, or is on a node that goes offline. Running a single replica means any failure causes a brief outage.
- **max: 5** -- Caps resource consumption. For a stateless in-memory service, 5 replicas can handle substantial traffic; increasing beyond this would require a larger cluster or real load testing data to justify.
- **50% CPU** -- A common starting point that provides a scaling buffer. If pods scale-up when they hit 50% CPU limit, there is still headroom before saturation. A threshold too close to 100% means the HPA reacts too late; too close to 0% causes unnecessary scaling churn.

These numbers are appropriate for a development/assignment cluster. In production, they would be tuned based on load test results and P99 latency SLOs.

---

## 4. Path-Based Ingress Routing

**Decision:** A single Ingress resource routes `/v1`, `/v1.1`, and `/v2` to three separate Kubernetes Services (in three separate namespaces), using path rewriting to strip the version prefix before forwarding.

**Rationale:**

Path-based routing is the simplest approach for exposing multiple services through one IP/domain without managing multiple LoadBalancer IPs or DNS records. It lets the consumer address all versions at `<host>/v1`, `<host>/v1.1`, `<host>/v2` -- intuitive and easy to document.

The `rewrite-target: /$2` annotation strips the `/v1` prefix so backends see clean paths (`/health`, `/products`) without needing to be version-aware themselves. This is standard NGINX Ingress behaviour.

**Cross-namespace routing** uses ExternalName Services in the `default` namespace as DNS aliases to each version's ClusterIP (`<svc>.<namespace>.svc.cluster.local`). This is the standard Kubernetes solution to cross-namespace Ingress routing -- no extra controllers or CRDs required.

---

## 5. Static In-Memory Data (no database)

**Decision:** Product data is a plain TypeScript array in `src/data/products.data.ts`. No database, no ORM, no migrations.

**Rationale:**

The assignment evaluates deployment mechanics (containers, Kubernetes, CI/CD), not data persistence. Adding a database (Postgres, SQLite, Redis) would:
- Require a StatefulSet or external DB service in Kubernetes
- Add a migration step to the Dockerfile CMD
- Complicate the CI pipeline (DB setup, connection strings as secrets)
- Introduce a dependency that can fail independently of the application

An in-memory array is perfectly adequate for demonstrating the full deployment pipeline. If the data needs to change, it's a one-line edit and a redeploy -- no schema migration needed.

---

## What Would Change for Production

This service is purpose-built for a deployment assignment. A production version would differ in these ways:

### Data Layer
- **Replace the in-memory array with PostgreSQL** (or another durable store). Products would be managed via an admin API or CMS, not by editing source code. The ORM of choice (Prisma, Drizzle) would handle migrations.
- **Connection pooling** via PgBouncer or equivalent to handle the concurrency that Kubernetes horizontal scaling creates.

### Secrets Management
- **Replace GitHub Secrets with a secrets manager** (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager). GitHub Secrets are fine for CI credentials but not for runtime application secrets -- they aren't rotated automatically, aren't auditable at the secret-read level, and can't be referenced dynamically by running pods.
- **Kubernetes Secrets** would be used for the DB connection string, populated by the secrets manager via an operator (External Secrets Operator is the standard).

### Kubernetes Infrastructure
- **Real cloud cluster** (EKS, GKE, AKS) instead of Minikube. Minikube runs in a single VM; production needs multi-node, multi-AZ clusters with proper node auto-provisioning.
- **Real CI deploy step** -- the `dry-run-deploy` job would be replaced with `kubectl apply` (or `helm upgrade`) against the cloud cluster, with kubeconfig credentials injected via OIDC (not long-lived tokens).
- **cert-manager + Let's Encrypt** for TLS instead of self-signed certificates. Let's Encrypt provides free, automatically-renewed certificates; cert-manager handles the issuance and renewal lifecycle within Kubernetes.
- **Dedicated Ingress controller** deployed via Helm for production-grade configuration, annotations, and observability -- the Minikube addon is convenient but not production-configurable.

### Observability
- **Structured logging** (Pino, as used in the identity-reconciliation service) shipped to a log aggregator (CloudWatch, Datadog, Loki).
- **Metrics** via Prometheus/OpenTelemetry -- request rate, latency percentiles, error rate. The HPA would use custom metrics (RPS or latency) rather than just CPU.
- **Distributed tracing** (OpenTelemetry -> Jaeger/Tempo) for debugging cross-service calls.

### Versioning Strategy
- **Blue-green or canary deployments** via Argo Rollouts or Flagger, rather than three statically-named namespaces. This allows gradual traffic shifting between versions with automatic rollback on error rate spikes.
