<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		variant?: 'default' | 'chips';
		children: Snippet;
	}

	let { label, variant = 'default', children }: Props = $props();
</script>

<div class="worn-toolbar" class:is-chips={variant === 'chips'} role="group" aria-label={label?.trim() || 'Toolbar'}>
	{@render children()}
</div>

<style>
	.worn-toolbar {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--worn-toolbar-gap, 8px);
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin: 0 0 var(--worn-toolbar-margin-block-end, 12px);
		padding: var(--worn-toolbar-padding, 10px);
		position: relative;
		overflow: visible;
		border: 1px solid var(--worn-toolbar-border, var(--cockpit-border, #c8ceca));
		border-radius: var(--worn-toolbar-radius, var(--cockpit-radius, 6px));
		background: var(--worn-toolbar-background, var(--cockpit-surface, transparent));
		box-shadow: var(--worn-toolbar-shadow, none);
		transition: border-color 120ms ease, box-shadow 120ms ease;
	}

	.worn-toolbar.is-chips {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(128px, 100%), 1fr));
	}

	:global(.worn-toolbar > *) {
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	.worn-toolbar:hover,
	.worn-toolbar:focus-within {
		border-color: var(--worn-toolbar-active-border, var(--cockpit-accent, #287f73));
		box-shadow: var(--worn-toolbar-active-shadow, 0 0 0 1px var(--cockpit-accent, #287f73));
	}

	@media (max-width: 500px) {
		.worn-toolbar {
			gap: var(--worn-toolbar-compact-gap, 4px);
			padding: var(--worn-toolbar-compact-padding, 6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-toolbar { transition: none; }
	}
</style>
