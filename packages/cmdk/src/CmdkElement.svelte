<svelte:options customElement={{ tag: 'worn-cmdk', shadow: 'none', props: { items: { type: 'Array' }, placeholder: {} } }} />

<script lang="ts">
	import Cmdk from './Cmdk.svelte';
	import type { CmdkHandle, CmdkItem } from './types.js';

	let { items = [], placeholder = 'Search…' }: {
		items?: CmdkItem[];
		placeholder?: string;
	} = $props();

	let component: CmdkHandle;
	const host = $host<HTMLElement>();

	export function open() {
		component?.open();
	}

	function handleClose() {
		host.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
	}
</script>

<Cmdk bind:this={component} {items} {placeholder} onclose={handleClose} />
