<svelte:options customElement={{ tag: 'worn-theme', shadow: 'none', props: { theme: {}, storageKey: { attribute: 'storage-key' } } }} />

<script lang="ts">
	import Theme from './Theme.svelte';
	import type { EffectiveTheme, ThemeName } from './types.js';

	let {
		theme = $bindable('system' as ThemeName),
		storageKey = 'wrn-theme',
	}: {
		theme?: ThemeName;
		storageKey?: string;
	} = $props();

	let element: HTMLElement;

	function emitChange(nextTheme: ThemeName, effectiveTheme: EffectiveTheme) {
		element?.dispatchEvent(new CustomEvent('wrn-theme-change', {
			detail: { theme: nextTheme, effectiveTheme },
			bubbles: true,
		}));
	}
</script>

<div bind:this={element} style="display:contents">
	<Theme bind:theme {storageKey} onchange={emitChange} />
</div>
