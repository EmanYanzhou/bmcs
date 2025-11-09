import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    name: 'core',
    environment: 'node',
    include: ['specs/**/*.spec.ts'],
    exclude: ['vitest.config.ts', 'coverage/**'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['../src/**/*.ts'],
      reportsDirectory: resolve(__dirname, './coverage'),
      cleanOnRerun: true,
    },
  },
  resolve: {
    alias: {
      '@bmcs/core': resolve(__dirname, '../src/index.ts'),
    },
  },
});
