<svelte:options customElement={{
	tag: 'worn-button',
	shadow: 'none',
	props: {
		label: {},
		variant: {},
		disabled: { type: 'Boolean' },
		size: {},
		type: {},
		href: {}
	}
}} />

<script lang="ts">
	import Button from './WornButton.svelte';

	let {
		label = 'Button',
		variant = 'default',
		disabled = false,
		size = 'md',
		type = 'button',
		href
	}: {
		label?: string;
		variant?: 'primary' | 'default' | 'danger' | 'warning';
		disabled?: boolean;
		size?: 'sm' | 'md';
		type?: 'button' | 'submit';
		href?: string;
	} = $props();
</script>

<Button {variant} {disabled} {size} {type} {href}>{label}</Button>
