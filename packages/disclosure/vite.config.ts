import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected',
    },
    dynamicCompileOptions: ({ filename }) => ({
      customElement: filename.endsWith('Element.svelte'),
    }),
  })],
  build: {
    lib: {
      entry: 'src/elements.ts',
      formats: ['es'],
      fileName: () => 'worn-disclosure.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
