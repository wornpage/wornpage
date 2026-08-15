import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected'
    },
    dynamicCompileOptions: ({ filename }) => {
      if (filename.endsWith('TabsElement.svelte')) return { customElement: true };
    }
  })],
  build: {
    lib: {
      entry: 'src/TabsElement.svelte',
      formats: ['es'],
      fileName: () => 'worn-tabs.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
