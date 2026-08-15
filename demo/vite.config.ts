import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [svelte({
    onwarn(warning) {
      throw new Error(`[svelte:${warning.code}] ${warning.message}`);
    },
  })],
  base: './',
  resolve: {
    alias: {
      '@wornpage/toast': fileURLToPath(new URL('./src/adapters/toast.ts', import.meta.url)),
      '@wornpage/undo': fileURLToPath(new URL('./src/adapters/undo.ts', import.meta.url)),
    },
  },
  optimizeDeps: { include: ['@wornpage/sync'] },
  build: { outDir: 'dist' }
});
