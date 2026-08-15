<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	interface Props {
		title: string;
		description?: string;
		children?: any;
	}

	let { title, description, children }: Props = $props();
</script>

<div class="worn-empty" role="note" in:fly={{ y: prefersReducedMotion.current ? 0 : 12, duration: prefersReducedMotion.current ? 0 : 250 }}>
	<strong>{title}</strong>
	{#if description}<span>{description}</span>{/if}
	{@render children?.()}
</div>

<style>
	.worn-empty {
		border: 1px dashed var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		box-sizing: border-box;
		color: var(--cockpit-text-muted);
		display: grid;
		font-family: var(--font-typewriter);
		gap: 6px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		padding: 22px;
	}

	.worn-empty > * {
		min-inline-size: 0;
	}

	.worn-empty strong {
		color: var(--cockpit-text);
		display: block;
	}

	.worn-empty span {
		color: var(--cockpit-text-secondary);
		display: block;
	}

	.worn-empty :global(.worn-btn) {
		justify-self: start;
		margin-top: 2px;
	}
</style>
