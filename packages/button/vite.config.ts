import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected'
    },
    dynamicCompileOptions: ({ filename }) => {
      if (filename.endsWith('ButtonElement.svelte')) return { customElement: true };
    }
  })],
  build: {
    lib: {
      entry: 'src/ButtonElement.svelte',
      formats: ['es'],
      fileName: () => 'worn-button.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
