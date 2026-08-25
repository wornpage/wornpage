<script lang="ts">
	import type { SelectCardProps } from './types.js';

	let {
		label,
		description,
		pressed = false,
		disabled = false,
		onclick,
		...rest
	}: SelectCardProps = $props();
</script>

<button
	{...rest}
	type="button"
	class="worn-select-card"
	aria-pressed={pressed}
	{disabled}
	{onclick}
>
	<strong>{label}</strong>
	{#if description}<span>{description}</span>{/if}
</button>

<style>
	.worn-select-card {
		box-sizing: border-box;
		max-inline-size: 100%;
		min-block-size: 44px;
		min-inline-size: 0;
		padding: 12px 16px;
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		background: transparent;
		color: var(--cockpit-text-secondary);
		cursor: pointer;
		font: inherit;
		letter-spacing: 0;
		text-align: left;
		touch-action: manipulation;
		transition: border-color 0.12s ease, background-color 0.12s ease, color 0.12s ease;
	}
	.worn-select-card strong,
	.worn-select-card span {
		display: block;
		max-inline-size: 100%;
		overflow-wrap: anywhere;
	}
	.worn-select-card strong {
		font-size: var(--worn-select-card-title-size, 15px);
		font-weight: 600;
		line-height: 1.3;
	}
	.worn-select-card span {
		margin-top: 2px;
		color: var(--cockpit-text-muted);
		font-size: 12px;
		line-height: 1.4;
	}
	.worn-select-card[aria-pressed='true'] {
		background: var(--cockpit-accent);
		border-color: var(--cockpit-accent);
		color: var(--cockpit-accent-text);
	}
	.worn-select-card[aria-pressed='true'] strong,
	.worn-select-card[aria-pressed='true'] span {
		color: inherit;
	}
	@media (hover: hover) and (pointer: fine) {
		.worn-select-card:hover:not([aria-pressed='true']):not(:disabled) {
			border-color: var(--cockpit-border-strong);
		}
	}
	.worn-select-card:focus-visible {
		outline: 2px dashed var(--worn-select-card-focus, currentColor);
		outline-offset: 2px;
	}
	.worn-select-card:disabled {
		background: var(--cockpit-bg-secondary);
		border-color: var(--cockpit-border);
		color: var(--cockpit-text-muted);
		cursor: not-allowed;
		opacity: 1;
	}
	.worn-select-card:disabled span {
		color: inherit;
	}
	.worn-select-card[aria-pressed='true']:disabled {
		background: var(--cockpit-surface-raised);
		border-color: var(--cockpit-border-strong);
		color: var(--cockpit-text-secondary);
	}
	@media (prefers-reduced-motion: reduce) {
		.worn-select-card { transition: none; }
	}
</style>
