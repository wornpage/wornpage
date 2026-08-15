import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      css: 'injected'
    },
    dynamicCompileOptions: ({ filename }) => {
      if (filename.endsWith('SegmentedControlElement.svelte')) return { customElement: true };
    }
  })],
  build: {
    lib: {
      entry: 'src/SegmentedControlElement.svelte',
      formats: ['es'],
      fileName: () => 'worn-segmented-control.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
