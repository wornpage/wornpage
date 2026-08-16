<script lang="ts">
	import type { ButtonProps } from './types';

	let {
		variant = 'default',
		disabled = false,
		size = 'md',
		type = 'button',
		href,
		class: className,
		onclick,
		children,
		...rest
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		{href}
		{...rest}
		class={className ? `worn-btn ${className}` : 'worn-btn'}
		class:is-primary={variant === 'primary'}
		class:is-danger={variant === 'danger'}
		class:is-warning={variant === 'warning'}
		class:is-sm={size === 'sm'}
		aria-disabled={disabled || undefined}
		tabindex={disabled ? -1 : undefined}
		onclick={(e) => {
			if (disabled) { e.preventDefault(); return; }
			onclick?.(e);
		}}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{...rest}
		class={className ? `worn-btn ${className}` : 'worn-btn'}
		class:is-primary={variant === 'primary'}
		class:is-danger={variant === 'danger'}
		class:is-warning={variant === 'warning'}
		class:is-sm={size === 'sm'}
		{disabled}
		onclick={onclick}
	>
		{@render children?.()}
	</button>
{/if}

<style>
	.worn-btn {
		appearance: none;
		box-sizing: border-box;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		max-inline-size: 100%;
		min-inline-size: 0;
		font-family: var(--font-typewriter);
		font-size: 13px;
		font-weight: 610;
		letter-spacing: 0;
		line-height: 1.2;
		min-height: 36px;
		overflow-wrap: anywhere;
		padding: 8px 16px;
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		background: var(--cockpit-surface);
		color: var(--cockpit-text);
		cursor: pointer;
		text-align: center;
		text-decoration: none;
		touch-action: manipulation;
		transition: transform 0.08s ease, box-shadow 0.12s ease, background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease;
		user-select: none;
		white-space: normal;
	}
	.worn-btn > :global(*) {
		max-inline-size: 100%;
		min-inline-size: 0;
	}
	.worn-btn.is-sm {
		font-size: 12px;
		min-height: 32px;
		padding: 4px 10px;
	}
	.worn-btn.is-primary {
		background: var(--cockpit-accent);
		border-color: var(--cockpit-accent);
		color: var(--cockpit-accent-text);
		transform: rotate(-0.3deg);
	}
	.worn-btn.is-primary:active:not(:disabled):not([aria-disabled='true']) {
		transform: rotate(0deg) translateY(1px);
	}
	.worn-btn.is-danger {
		background: var(--cockpit-danger-bg);
		border-color: var(--cockpit-danger-border);
		color: var(--cockpit-danger-text);
	}
	.worn-btn.is-warning {
		background: transparent;
		border-color: var(--cockpit-warning-text);
		color: var(--cockpit-warning-text);
	}
	.worn-btn.is-warning:hover:not(:disabled):not([aria-disabled='true']) {
		background: var(--cockpit-warning-bg);
	}
	.worn-btn:hover:not(:disabled):not([aria-disabled='true']) {
		filter: brightness(0.96);
	}
	.worn-btn:active:not(:disabled):not([aria-disabled='true']) {
		transform: translateY(1px);
	}
	.worn-btn:focus-visible {
		outline: 2px dashed var(--worn-button-focus, var(--cockpit-text, #21322b));
		outline-offset: 2px;
	}
	@media (pointer: coarse) {
		.worn-btn,
		.worn-btn.is-sm {
			min-width: 44px;
			min-height: 44px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.worn-btn {
			transition: none;
		}
	}
	.worn-btn:global(.is-active) {
		background: var(--cockpit-accent);
		border-color: var(--cockpit-accent);
		color: var(--cockpit-accent-text);
		animation: energy-pulse 0.2s ease-out;
	}
	.worn-btn.worn-btn:disabled,
	.worn-btn.worn-btn[aria-disabled='true'] {
		background: var(--cockpit-bg-secondary);
		border-color: var(--cockpit-border);
		color: var(--cockpit-text-muted);
		cursor: not-allowed;
		filter: none;
		opacity: 1;
		transform: none;
		translate: 0 0;
		box-shadow: none;
		animation: none;
	}
</style>
