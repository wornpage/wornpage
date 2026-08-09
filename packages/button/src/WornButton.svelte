<script lang="ts">
	interface Props {
		variant?: 'primary' | 'default' | 'danger' | 'warning';
		disabled?: boolean;
		size?: 'sm' | 'md';
		type?: 'button' | 'submit';
		href?: string;
		onclick?: (e: MouseEvent) => void;
		children?: any;
		[key: string]: unknown;
	}
	let {
		variant = 'default',
		disabled = false,
		size = 'md',
		type = 'button',
		href,
		onclick,
		children,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		{...rest}
		class="worn-btn"
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
		class="worn-btn"
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-family: var(--font-typewriter);
		font-size: 13px;
		font-weight: 610;
		line-height: 1.2;
		padding: 8px 16px;
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		background: var(--cockpit-surface);
		color: var(--cockpit-text);
		cursor: pointer;
		transition: transform 0.08s ease, box-shadow 0.12s ease, background-color 0.1s ease, color 0.1s ease, border-color 0.1s ease;
		user-select: none;
	}
	.worn-btn.is-sm {
		font-size: 12px;
		min-height: 44px;
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
		outline: 2px dashed var(--cockpit-accent);
		outline-offset: 2px;
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
