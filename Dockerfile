# ─── Stage 1: Build ───────────────────────────────────────────────────────────
#
# Use node:20-slim (not Alpine) for the same reason as the identity-reconciliation
# service: Alpine's musl libc causes subtle compatibility issues with native
# modules. slim is Debian-based, works reliably, and is small enough (~200MB).
#
FROM node:20-slim AS builder

WORKDIR /app

# Copy package manifests first to leverage Docker layer caching.
# npm ci only re-runs if package-lock.json changes — not on every source edit.
COPY package*.json ./

# Install ALL deps (including devDependencies) for the TypeScript build step
RUN npm ci

# Copy source and compile TypeScript → JavaScript into dist/
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
#
# Fresh base image — no build tools, no devDependencies, no source files.
# Only what's needed to run the compiled application.
#
FROM node:20-slim AS runtime

WORKDIR /app

# wget is needed for the HEALTHCHECK command below.
# slim doesn't include it by default; install it cleanly.
RUN apt-get update -y && apt-get install -y --no-install-recommends wget \
  && rm -rf /var/lib/apt/lists/*

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist/

# chown before switching to non-root user so node can read/write the app dir.
# This mirrors the fix applied in the identity-reconciliation service.
RUN chown -R node:node /app

# APP_VERSION is intentionally NOT set here — it is injected at runtime via
# Kubernetes env (see k8s/<version>/deployment.yaml).
# This means one image can be deployed as v1.0, v1.1, or v2.0 with zero
# image rebuilds — just change the env var.
ENV PORT=3000

EXPOSE 3000

# Health check hits the /health endpoint.
# --start-period gives the server time to start before the first check.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Drop to non-root user for security (node user is built into the node image)
USER node

CMD ["node", "dist/server.js"]
