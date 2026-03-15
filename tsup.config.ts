import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/client/index.ts',
    },
    outDir: 'dist/client',
    format: ['iife'],
    platform: 'browser',
    target: 'es2020',
    minify: false,
    bundle: true,
    clean: true,
    outExtension() {
      return {
        js: `.js`,
      }
    },
  },
  {
    entry: {
      index: 'src/server/index.ts',
    },
    outDir: 'dist/server',
    format: ['cjs'],
    platform: 'node',
    target: 'node16',
    minify: false,
    bundle: true,
    clean: true,
    noExternal: ['valibot', 'cross-fetch', 'form-data'],
  }
]);
