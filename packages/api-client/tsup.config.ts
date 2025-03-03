import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['../../apps/api/src/api/client-types.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'src',
  external: ['zod', 'hono', '@hono/zod-validator', '@taxel/domain'],
});
