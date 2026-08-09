/**
 * tests/health.test.ts
 *
 * Tests for GET /health across all three versions.
 *
 * Strategy: create the app with APP_VERSION set via process.env before each
 * test group, then reset it afterwards. This exercises the version-awareness
 * of the health endpoint without spinning up a real server.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/expressApp';

// ── v1.0 ──────────────────────────────────────────────────────────────────────

describe('GET /health — v1.0', () => {
  beforeAll(() => {
    process.env.APP_VERSION = 'v1.0';
  });

  afterAll(() => {
    delete process.env.APP_VERSION;
  });

  it('returns 200 with status ok and version v1.0', async () => {
    const app = createApp();
    const res = await supertest(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', version: 'v1.0' });
  });
});

// ── v1.1 ──────────────────────────────────────────────────────────────────────

describe('GET /health — v1.1', () => {
  beforeAll(() => {
    process.env.APP_VERSION = 'v1.1';
  });

  afterAll(() => {
    delete process.env.APP_VERSION;
  });

  it('returns 200 with status ok and version v1.1', async () => {
    const app = createApp();
    const res = await supertest(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', version: 'v1.1' });
  });
});

// ── v2.0 ──────────────────────────────────────────────────────────────────────

describe('GET /health — v2.0', () => {
  beforeAll(() => {
    process.env.APP_VERSION = 'v2.0';
  });

  afterAll(() => {
    delete process.env.APP_VERSION;
  });

  it('returns 200 with status ok and version v2.0', async () => {
    const app = createApp();
    const res = await supertest(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', version: 'v2.0' });
  });
});

// ── 404 for unknown routes ────────────────────────────────────────────────────

describe('Unknown routes', () => {
  it('returns 404 JSON for unknown routes', async () => {
    process.env.APP_VERSION = 'v1.0';
    const app = createApp();
    const res = await supertest(app).get('/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
