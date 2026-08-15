<svelte:options customElement={{
	tag: 'worn-segmented-control',
	shadow: 'none',
	props: {
		options: {},
		active: {},
		name: {},
		label: {},
	}
}} />

<script lang="ts">
	import SegmentedControl from './SegmentedControl.svelte';
	import type { SegmentedOption } from './types.js';

	let {
		options = [],
		active = $bindable(''),
		name = 'choice',
		label = 'Choice',
	}: {
		options?: SegmentedOption[];
		active?: string;
		name?: string;
		label?: string;
	} = $props();

	const host = $host<HTMLElement>();

	function handleChange(id: string) {
		active = id;
		host.dispatchEvent(new CustomEvent('change', { detail: { id }, bubbles: true }));
	}
</script>

<SegmentedControl {options} bind:active {name} {label} onchange={handleChange} />
