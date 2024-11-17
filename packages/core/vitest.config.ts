import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/__tests__/**'],
    setupFiles: ['tests/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/index.ts', 'tests/__tests__/**'],
    },
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.json',
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    watchExclude: ['**/node_modules/**', '**/dist/**', 'tests/__tests__/**'],
  },
});
