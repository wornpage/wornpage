import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    onwarn(warning) {
      throw new Error(`[svelte:${warning.code}] ${warning.message}`);
    },
  })],
  base: './',
  optimizeDeps: { include: ['@wornpage/sync'] },
  build: { outDir: 'dist' }
});
