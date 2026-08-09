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
			entry: 'src/Cmdk.svelte',
			formats: ['es'],
			fileName: () => 'worn-cmdk.js'
		},
		outDir: 'dist',
		emptyOutDir: true
	}
});
