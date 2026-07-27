<svelte:options customElement={{ tag: 'worn-theme', shadow: 'none', props: { theme: {} } }} />

<script lang="ts">
	import Theme from './Theme.svelte';
	import { applyTheme, THEMES, resolveTheme } from './types.js';
	import type { ThemeName } from './types.js';

	let { theme = 'system' }: { theme?: string } = $props();

	let el: HTMLElement;

	function emit(name: string, detail: any) { el?.dispatchEvent(new CustomEvent(name, { detail, bubbles: true })); }

	// Apply on mount (no reactivity — WC handles via property)
	$effect(() => {
		try {
			const saved = localStorage.getItem('wrn-theme') as ThemeName | null;
			if (saved && THEMES.includes(saved as any)) {
				theme = saved;
				applyTheme(saved);
				emit('wrn-theme-change', { theme: saved });
				return;
			}
		} catch {}
	});
</script>

<div bind:this={el} style="display:contents">
<Theme bind:theme={theme as ThemeName} />
</div>
