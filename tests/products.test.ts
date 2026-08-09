/**
 * tests/products.test.ts
 *
 * Tests for GET /products and GET /products/search across all three versions.
 *
 * Coverage:
 *   v1.0 — /products returns full array; /products/search returns 404 (not mounted)
 *   v1.1 — /products/search?keyword= works; returns [] for no matches (not 404/500)
 *   v2.0 — search with category, minPrice, maxPrice filters; 400 on invalid numbers
 *
 * Note: process.env.APP_VERSION must be set BEFORE createApp() is called,
 * because products.route.ts reads it at module load time to decide which
 * routes to mount. Each describe block creates a fresh app instance with
 * the correct version set.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/expressApp';
import { products } from '../src/data/products.data';

// ── v1.0 ──────────────────────────────────────────────────────────────────────

describe('Products — v1.0', () => {
  // Must be beforeAll (not beforeEach) because createApp() is called once per suite
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    process.env.APP_VERSION = 'v1.0';
    app = createApp();
  });

  afterAll(() => {
    delete process.env.APP_VERSION;
  });

  it('GET /products returns full product array (200)', async () => {
    const res = await supertest(app).get('/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(products.length);
    // Spot-check a product's shape
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('category');
    expect(res.body[0]).toHaveProperty('price');
  });

  it('GET /products/search returns 404 in v1.0 (route not mounted)', async () => {
    const res = await supertest(app).get('/products/search?keyword=laptop');
    // Route is not mounted for v1.0 — falls through to 404 handler
    expect(res.status).toBe(404);
  });
});

// ── v1.1 ──────────────────────────────────────────────────────────────────────

describe('Products — v1.1', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    process.env.APP_VERSION = 'v1.1';
    app = createApp();
  });

  afterAll(() => {
    delete process.env.APP_VERSION;
  });

  it('GET /products still returns full array in v1.1', async () => {
    const res = await supertest(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(products.length);
  });

  it('GET /products/search?keyword=headphones finds a match', async () => {
    const res = await supertest(app).get('/products/search?keyword=headphones');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    // Should find "Wireless Noise-Cancelling Headphones"
    expect(res.body[0].name.toLowerCase()).toContain('headphone');
  });

  it('GET /products/search?keyword= is case-insensitive', async () => {
    const res = await supertest(app).get('/products/search?keyword=KEYBOARD');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name.toLowerCase()).toContain('keyboard');
  });

  it('GET /products/search with no match returns empty array (not 404)', async () => {
    const res = await supertest(app).get('/products/search?keyword=zzznomatch999');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('GET /products/search?category= is ignored in v1.1 (no 500)', async () => {
    // In v1.1, extra params are silently ignored — no crash
    const res = await supertest(app).get('/products/search?keyword=jacket&category=Clothing');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ── v2.0 ──────────────────────────────────────────────────────────────────────

describe('Products — v2.0', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    process.env.APP_VERSION = 'v2.0';
    app = createApp();
  });

  afterAll(() => {
    delete process.env.APP_VERSION;
  });

  it('GET /products returns full array in v2.0', async () => {
    const res = await supertest(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(products.length);
  });

  it('GET /products/search?category=Electronics returns only Electronics', async () => {
    const res = await supertest(app).get('/products/search?category=Electronics');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((p: { category: string }) => {
      expect(p.category).toBe('Electronics');
    });
  });

  it('GET /products/search?minPrice=100&maxPrice=200 returns products in range', async () => {
    const res = await supertest(app).get('/products/search?minPrice=100&maxPrice=200');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((p: { price: number }) => {
      expect(p.price).toBeGreaterThanOrEqual(100);
      expect(p.price).toBeLessThanOrEqual(200);
    });
  });

  it('GET /products/search with keyword + category + price range (AND logic)', async () => {
    // Look for Yoga Mat in Sports, price 0-100
    const res = await supertest(app).get(
      '/products/search?keyword=yoga&category=Sports&minPrice=0&maxPrice=100'
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((p: { name: string; category: string; price: number }) => {
      expect(p.name.toLowerCase()).toContain('yoga');
      expect(p.category).toBe('Sports');
      expect(p.price).toBeLessThanOrEqual(100);
    });
  });

  it('GET /products/search?minPrice=abc returns 400 with JSON error', async () => {
    const res = await supertest(app).get('/products/search?minPrice=abc');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('detail');
    expect(res.body.detail).toContain('minPrice');
  });

  it('GET /products/search?maxPrice=xyz returns 400 with JSON error', async () => {
    const res = await supertest(app).get('/products/search?maxPrice=xyz');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.detail).toContain('maxPrice');
  });

  it('GET /products/search with no filters returns all products', async () => {
    const res = await supertest(app).get('/products/search');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(products.length);
  });

  it('GET /products/search?category=Electronics&minPrice=50&maxPrice=150 (combined filters)', async () => {
    const res = await supertest(app).get(
      '/products/search?category=Electronics&minPrice=50&maxPrice=150'
    );

    expect(res.status).toBe(200);
    res.body.forEach((p: { category: string; price: number }) => {
      expect(p.category).toBe('Electronics');
      expect(p.price).toBeGreaterThanOrEqual(50);
      expect(p.price).toBeLessThanOrEqual(150);
    });
  });
});
