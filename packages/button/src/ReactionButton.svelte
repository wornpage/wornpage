<script lang="ts">
	import type { ReactionButtonProps } from './types';

	let {
		reaction,
		label,
		count = 0,
		pressed = false,
		disabled = false,
		type = 'button',
		class: className,
		onclick,
		...rest
	}: ReactionButtonProps = $props();

	let accessibleLabel = $derived(`${label || `React ${reaction}`}${count > 0 ? `, ${count}` : ''}`);
	let rootClass = $derived(className ? `worn-reaction-btn ${className}` : 'worn-reaction-btn');
</script>

<button
	{type}
	{disabled}
	{...rest}
	class={rootClass}
	class:is-pressed={pressed}
	aria-label={accessibleLabel}
	aria-pressed={pressed}
	onclick={onclick}
>
	<span class="worn-reaction-mark" aria-hidden="true">{reaction}</span>
	{#if count > 0}<span class="worn-reaction-count" aria-hidden="true">{count}</span>{/if}
</button>

<style>
	.worn-reaction-btn {
		align-items: center;
		appearance: none;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 999px;
		box-sizing: border-box;
		color: var(--cockpit-text, #21322b);
		cursor: pointer;
		display: inline-flex;
		font: inherit;
		gap: 4px;
		justify-content: center;
		line-height: 1.2;
		max-inline-size: 100%;
		min-block-size: 44px;
		min-inline-size: 44px;
		overflow-wrap: anywhere;
		padding: 6px 10px;
		touch-action: manipulation;
		transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease, box-shadow 0.1s ease, filter 0.1s ease;
		-webkit-tap-highlight-color: transparent;
	}
	@media (hover: hover) and (pointer: fine) {
		.worn-reaction-btn:hover:not(:disabled) {
			background: var(--cockpit-hover-bg, #eef2ef);
			border-color: var(--cockpit-border, #c8c2b9);
		}
	}
	.worn-reaction-btn:active:not(:disabled) {
		filter: brightness(0.94);
		box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.12);
	}
	.worn-reaction-btn:focus-visible {
		outline: 2px dashed var(--worn-button-focus, var(--cockpit-focus, var(--cockpit-text, #21322b)));
		outline-offset: 2px;
	}
	.worn-reaction-btn.is-pressed {
		background: var(--cockpit-accent-50, #dff4ef);
		border-color: var(--cockpit-accent, #0f766e);
		color: var(--cockpit-text, #21322b);
	}
	.worn-reaction-btn:disabled {
		background: var(--cockpit-bg-secondary, #f0eee8);
		border-color: var(--cockpit-border, #c8c2b9);
		color: var(--cockpit-text-muted, #596a61);
		cursor: not-allowed;
		opacity: 1;
		box-shadow: none;
	}
	.worn-reaction-mark {
		flex: none;
		font-size: 15px;
	}
	.worn-reaction-count {
		color: var(--cockpit-text-muted, #596a61);
		font-size: 11px;
		font-weight: 600;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}
	.worn-reaction-btn.is-pressed .worn-reaction-count {
		color: inherit;
	}
	@media (prefers-reduced-motion: reduce) {
		.worn-reaction-btn { transition: none; }
	}
	@media (forced-colors: active) {
		.worn-reaction-btn { border-color: ButtonText; }
		.worn-reaction-btn.is-pressed { background: Highlight; color: HighlightText; }
		.worn-reaction-btn:focus-visible { outline-color: Highlight; }
	}
</style>
