import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Look for .ts files when .js extensions are used (ESM convention)
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  test: {
    // Tests are stateless (no DB) so they can run in parallel without issues
    testTimeout: 10000,
  },
});
