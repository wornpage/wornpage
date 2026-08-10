import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected'
    },
    dynamicCompileOptions: ({ filename }) => {
      if (filename.endsWith('UndoElement.svelte')) return { customElement: true };
    }
  })],
  build: {
    lib: {
      entry: 'src/UndoElement.svelte',
      formats: ['es'],
      fileName: () => 'worn-undo.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
