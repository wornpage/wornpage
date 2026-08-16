<script lang="ts">
	import type { IconButtonProps } from './types';

	let {
		label,
		title = label,
		variant = 'default',
		disabled = false,
		size = 'md',
		type = 'button',
		class: className,
		onclick,
		children,
		...rest
	}: IconButtonProps = $props();
</script>

<button
	{...rest}
	{type}
	aria-label={label}
	{title}
	class={className ? `worn-icon-btn ${className}` : 'worn-icon-btn'}
	class:is-danger={variant === 'danger'}
	class:is-sm={size === 'sm'}
	class:is-lg={size === 'lg'}
	{disabled}
	{onclick}
>
	<span class="worn-icon-btn-glyph" aria-hidden="true">{@render children?.()}</span>
</button>

<style>
	.worn-icon-btn {
		appearance: none;
		align-items: center;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 50%;
		box-sizing: border-box;
		color: var(--cockpit-text);
		cursor: pointer;
		display: inline-flex;
		flex: 0 0 44px;
		inline-size: 44px;
		justify-content: center;
		min-block-size: 44px;
		padding: 0;
		touch-action: manipulation;
		transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease, transform 0.08s ease;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}
	.worn-icon-btn.is-sm {
		flex-basis: 36px;
		inline-size: 36px;
		min-block-size: 36px;
	}
	.worn-icon-btn.is-lg {
		flex-basis: 48px;
		inline-size: 48px;
		min-block-size: 48px;
	}
	.worn-icon-btn-glyph {
		align-items: center;
		display: inline-flex;
		justify-content: center;
		line-height: 0;
		pointer-events: none;
	}
	.worn-icon-btn-glyph > :global(svg) {
		block-size: 18px;
		inline-size: 18px;
	}
	.worn-icon-btn.is-lg .worn-icon-btn-glyph > :global(svg) {
		block-size: 20px;
		inline-size: 20px;
	}
	.worn-icon-btn.is-danger { color: var(--cockpit-danger-text); }
	.worn-icon-btn:hover:not(:disabled) {
		background: var(--cockpit-bg-secondary);
		border-color: var(--cockpit-border);
		color: var(--cockpit-text);
	}
	.worn-icon-btn.is-danger:hover:not(:disabled) {
		background: var(--cockpit-danger-bg);
		border-color: var(--cockpit-danger-border);
		color: var(--cockpit-danger-text);
	}
	.worn-icon-btn:active:not(:disabled) { transform: translateY(1px); }
	.worn-icon-btn:focus-visible {
		outline: 2px dashed var(--worn-button-focus, var(--cockpit-focus, var(--cockpit-text, #21322b)));
		outline-offset: 2px;
	}
	.worn-icon-btn:disabled {
		background: var(--cockpit-bg-secondary);
		border-color: var(--cockpit-border);
		color: var(--cockpit-text-muted);
		cursor: not-allowed;
		opacity: 1;
		transform: none;
	}
	@media (pointer: coarse) {
		.worn-icon-btn.is-sm {
			flex-basis: 44px;
			inline-size: 44px;
			min-block-size: 44px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.worn-icon-btn { transition: none; }
	}
</style>
