import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected'
    },
    dynamicCompileOptions: ({ filename }) => {
      if (filename.endsWith('ThemeElement.svelte')) return { customElement: true };
    }
  })],
  build: {
    lib: {
      entry: 'src/elements.ts',
      formats: ['es'],
      fileName: () => 'worn-theme.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
