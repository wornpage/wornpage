<svelte:options customElement={{
	tag: 'worn-tabs',
	shadow: 'none',
	props: {
		active: {},
		tabs: {},
		controlId: { attribute: 'control-id' },
		label: {},
	}
}} />

<script lang="ts">
	import Tabs from './Tabs.svelte';
	import type { TabOption } from './types.js';

	let {
		active = $bindable(''),
		tabs = [],
		controlId,
		label = 'Sections',
	}: {
		active?: string;
		tabs?: TabOption[];
		controlId?: string;
		label?: string;
	} = $props();

	const host = $host<HTMLElement>();

	function handleChange(id: string) {
		active = id;
		host.dispatchEvent(new CustomEvent('change', { detail: { id }, bubbles: true }));
	}
</script>

<Tabs bind:active {tabs} id={controlId} {label} onchange={handleChange} />
