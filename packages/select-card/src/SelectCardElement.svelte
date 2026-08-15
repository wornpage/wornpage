<svelte:options customElement={{
	tag: 'worn-select-card',
	shadow: 'none',
	props: {
		label: {},
		description: {},
		pressed: { type: 'Boolean' },
		disabled: { type: 'Boolean' },
	}
}} />

<script lang="ts">
	import SelectCard from './SelectCard.svelte';

	let {
		label = 'Option',
		description,
		pressed = false,
		disabled = false,
	}: {
		label?: string;
		description?: string;
		pressed?: boolean;
		disabled?: boolean;
	} = $props();
</script>

<SelectCard {label} {description} {pressed} {disabled} />
