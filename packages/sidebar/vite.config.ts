import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: { css: 'injected' },
    dynamicCompileOptions: ({ filename }) => ({
      customElement: filename.endsWith('Element.svelte'),
    }),
  })],
  build: {
    lib: {
      entry: 'src/elements.ts',
      formats: ['es'],
      fileName: () => 'worn-sidebar.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
