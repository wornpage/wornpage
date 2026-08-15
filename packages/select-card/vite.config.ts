import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected'
    },
    dynamicCompileOptions: ({ filename }) => {
      if (filename.endsWith('SelectCardElement.svelte')) return { customElement: true };
    }
  })],
  build: {
    lib: {
      entry: 'src/SelectCardElement.svelte',
      formats: ['es'],
      fileName: () => 'worn-select-card.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
