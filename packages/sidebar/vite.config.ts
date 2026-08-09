import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      customElement: true,
      css: 'injected'
    }
  })],
  build: {
    lib: {
      entry: 'src/SidebarElement.svelte',
      formats: ['es'],
      fileName: () => 'worn-sidebar.js'
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
