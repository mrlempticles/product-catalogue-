# Product Catalogue Service

A lightweight microservice that exposes a curated product catalogue through a versioned REST API. Three API versions (v1.0, v1.1, v2.0) are implemented in a single codebase, activated at runtime by the `APP_VERSION` environment variable. The same Docker image is deployed three times to Kubernetes -- each deployment with a different `APP_VERSION` -- routing through a shared NGINX Ingress controller.

---

## Table of Contents

1. [API Versions & Endpoints](#api-versions--endpoints)
2. [Running Locally](#running-locally)
3. [Building & Running with Docker](#building--running-with-docker)
4. [Deploying to Minikube](#deploying-to-minikube)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Security Scanning](#security-scanning)
7. [GitHub Secrets](#github-secrets)

---

## API Versions & Endpoints

All versions share the same base endpoints. Each version adds to the previous.

### v1.0 - Base

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Returns `{ "status": "ok", "version": "v1.0" }` |
| `GET` | `/products` | Returns the full static product array (18 products) |

### v1.1 - Keyword Search

Everything in v1.0, plus:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/products/search?keyword=<str>` | Case-insensitive substring match against product name. Returns `[]` if nothing matches. |

### v2.0 - Full Search

Everything in v1.1, plus enhanced `/products/search`:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/products/search` | Supports `keyword`, `category`, `minPrice`, `maxPrice` -- all optional, AND-combined |

**v2.0 search params:**

| Param | Type | Description |
|-------|------|-------------|
| `keyword` | string | Case-insensitive substring match on product name |
| `category` | string | Exact match on category (case-insensitive). Values: `Electronics`, `Books`, `Clothing`, `Home & Kitchen`, `Sports` |
| `minPrice` | number | Minimum price (inclusive). Returns `400` if not a valid number. |
| `maxPrice` | number | Maximum price (inclusive). Returns `400` if not a valid number. |

**Example v2.0 responses:**

```bash
# All Electronics between $50 and $150
GET /products/search?category=Electronics&minPrice=50&maxPrice=150

# All Books with "data" in the name
GET /products/search?keyword=data&category=Books

# Invalid price -- returns 400
GET /products/search?minPrice=abc
# => { "error": "Invalid query parameter", "detail": "minPrice must be a valid number, got: \"abc\"" }
```

---

## Running Locally

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone and enter the project
cd product-catalogue-service

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env
# Edit .env to set APP_VERSION=v1.0 | v1.1 | v2.0

# Start the dev server (hot-reload via ts-node-dev)
npm run dev
```

The server listens on `http://localhost:3000`.

```bash
# Test locally
curl http://localhost:3000/health
curl http://localhost:3000/products
curl "http://localhost:3000/products/search?keyword=laptop"   # requires v1.1 or v2.0
```

### Running Tests

```bash
npm test
```

Tests cover all three versions using `supertest` against the Express app (no running server needed).

---

## Building & Running with Docker

### Build

```bash
docker build -t product-catalogue:local .
```

### Run (pick a version)

```bash
# v1.0
docker run --rm -p 3000:3000 -e APP_VERSION=v1.0 product-catalogue:local

# v1.1
docker run --rm -p 3000:3000 -e APP_VERSION=v1.1 product-catalogue:local

# v2.0
docker run --rm -p 3000:3000 -e APP_VERSION=v2.0 product-catalogue:local
```

### Verify

```bash
curl http://localhost:3000/health
# => {"status":"ok","version":"v2.0"}

curl "http://localhost:3000/products/search?category=Electronics&minPrice=50&maxPrice=200"
```

---

## Deploying to Minikube

### Prerequisites

```bash
# Ensure Minikube is running
minikube status

# Enable required addons (if not already enabled)
minikube addons enable ingress
minikube addons enable metrics-server
```

### Step 1 - Update the image name

Replace `DOCKERHUB_USERNAME` in all deployment manifests with your actual Docker Hub username:

```bash
# Windows PowerShell
Get-ChildItem -Recurse -Filter "deployment.yaml" | ForEach-Object {
  (Get-Content $_.FullName) -replace 'DOCKERHUB_USERNAME', 'yourusername' | Set-Content $_.FullName
}
```

### Step 2 - Build and push the image

```bash
docker build -t yourusername/product-catalogue:latest .
docker push yourusername/product-catalogue:latest
```

OR load it directly into Minikube (no push needed):

```bash
# Build and load into Minikube's Docker daemon
minikube image load product-catalogue:local

# Then update manifests to use: image: product-catalogue:local
# and imagePullPolicy: Never
```

### Step 3 - Apply manifests

Each version directory contains a `00-namespace.yaml` file. The `00-` prefix ensures
`kubectl apply -f` processes it first (files are applied in lexicographic order), so the
namespace exists before the Deployment and HPA that reference it.

```bash
# Each command creates the namespace and deploys the version in one shot
kubectl apply -f k8s/v1/
kubectl apply -f k8s/v1-1/
kubectl apply -f k8s/v2/

# Apply Ingress + ExternalName Services (in default namespace)
kubectl apply -f k8s/ingress.yaml
```

### Step 4 - Verify deployment

```bash
# Check all pods are Running (2 per version = 6 pods total)
kubectl get pods -A

# Check HPA status
kubectl get hpa -A

# Check Ingress
kubectl get ingress
```

### Step 5 - Test through the Ingress

```bash
MINIKUBE_IP=$(minikube ip)

# v1.0 - health
curl http://$MINIKUBE_IP/v1/health
# => {"status":"ok","version":"v1.0"}

# v1.0 - full product list
curl http://$MINIKUBE_IP/v1/products

# v1.1 - keyword search
curl "http://$MINIKUBE_IP/v1.1/products/search?keyword=keyboard"

# v2.0 - full search
curl "http://$MINIKUBE_IP/v2/products/search?category=Electronics&minPrice=50&maxPrice=200"

# v2.0 - invalid price (should return 400)
curl "http://$MINIKUBE_IP/v2/products/search?minPrice=notanumber"
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push to `main`.

### Jobs

| Job | Trigger | What it does |
|-----|---------|--------------|
| **test** | push to main | `npm ci` + `npm test` -- all Vitest tests must pass |
| **build-and-push** | after test passes | Builds Docker image, tags with `latest` + git SHA, pushes to Docker Hub |
| **integration-test** | after build succeeds | Runs the image via `docker run`, `curl`s `/health` and `/products`, asserts 200 |
| **dry-run-deploy** | after build succeeds | `kubectl apply --dry-run=client` against all manifests -- validates YAML syntax |

---

## Security Scanning

[Docker Scout](https://docs.docker.com/scout/) (built into Docker Desktop) is used to scan the image for known CVEs. No separate tool installation is required.

### Re-running the scan

```bash
# Full CVE detail (per-package, per-CVE breakdown)
docker scout cves sadmomo/product-catalogue:latest

# High-level policy summary (faster, good for a quick check)
docker scout quickview sadmomo/product-catalogue:latest
```

The full results of the most recent scan -- including a severity breakdown, a list of critical/high CVEs with fix availability, and a plain-English risk summary -- are in [SECURITY_SCAN.md](./SECURITY_SCAN.md).

---

## GitHub Secrets

Add these in **GitHub -> Repository -> Settings -> Secrets and variables -> Actions -> New repository secret**:

| Secret Name | Value | Where to get it |
|-------------|-------|-----------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | https://hub.docker.com |
| `DOCKERHUB_TOKEN` | A Docker Hub access token | https://hub.docker.com/settings/security -- New Access Token (use "Read & Write" scope) |

> **Important:** Use an access token, not your Docker Hub password. Tokens can be revoked individually and don't expose your account password.
