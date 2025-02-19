import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['../../apps/api/src/api/client-types.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'src',
});
