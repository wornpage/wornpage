<script lang="ts">
	import type { ToastProps } from './types.js';

	let { message, kind = 'info', dismissLabel = 'Dismiss notification', ondismiss, duration = 3000 }: ToastProps = $props();

	let visible = $state(true);
	let dismissing = $state(false);
	const EXIT_DURATION_MS = 180;

	function dismiss() {
		if (dismissing) return;
		dismissing = true;
		setTimeout(() => {
			visible = false;
			ondismiss?.();
		}, EXIT_DURATION_MS);
	}

	$effect(() => {
		if (duration <= 0) return;
		const timer = setTimeout(() => dismiss(), duration);
		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div class="wrn-toast" class:is-error={kind === 'error'} class:is-success={kind === 'success'} class:is-dismissing={dismissing}
		role={kind === 'error' ? 'alert' : 'status'}
		aria-live={kind === 'error' ? 'assertive' : 'polite'}
		aria-atomic="true"
	>
		<span class="wrn-toast-icon" aria-hidden="true">{kind === 'error' ? '✗' : kind === 'success' ? '✓' : '→'}</span>
		<span class="wrn-toast-text">{message}</span>
		<button type="button" class="wrn-toast-dismiss" onclick={dismiss} aria-label={dismissLabel}>&times;</button>
	</div>
{/if}

<style>
	@keyframes wrn-toast-enter {
		from { opacity: 0; transform: translateX(24px); }
		to { opacity: 1; transform: translateX(0); }
	}

	@keyframes wrn-toast-exit {
		from { opacity: 1; transform: translateX(0); }
		to { opacity: 0; transform: translateX(12px); }
	}

	.wrn-toast {
		display: flex; align-items: center; gap: 8px;
		background: var(--wrn-toast-bg, var(--cockpit-surface, #fdfbf7));
		border: 1px solid var(--wrn-toast-border, var(--cockpit-border, #e2ddd5));
		border-radius: var(--wrn-toast-radius, 6px);
		min-block-size: 44px;
		padding: 6px 8px 6px 14px;
		font-family: var(--wrn-toast-font, inherit);
		font-size: 13px; font-weight: 600;
		color: var(--wrn-toast-text, var(--cockpit-text, #21322b));
		text-align: start; width: 100%; max-inline-size: 100%; min-inline-size: 0;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
		position: relative; overflow: hidden;
		animation: wrn-toast-enter 220ms ease-out;
	}
	.wrn-toast.is-dismissing { animation: wrn-toast-exit 180ms ease-in forwards; pointer-events: none; }
	.wrn-toast.is-error { border-color: var(--wrn-toast-error-border, var(--cockpit-danger-border, #e74c3c)); background: var(--wrn-toast-error-bg, var(--cockpit-danger-bg, #fdf0ef)); }
	.wrn-toast.is-success { border-color: var(--wrn-toast-success-border, var(--cockpit-success-border, #27ae60)); background: var(--wrn-toast-success-bg, var(--cockpit-success-bg, #edf9f0)); }
	.wrn-toast-icon { font-size: 14px; line-height: 1; flex-shrink: 0; }
	.wrn-toast.is-error .wrn-toast-icon { color: var(--wrn-toast-error-text, var(--cockpit-danger-text, #e74c3c)); }
	.wrn-toast.is-success .wrn-toast-icon { color: var(--wrn-toast-success-text, var(--cockpit-success-text, #27ae60)); }
	.wrn-toast-text { flex: 1; max-inline-size: 100%; min-width: 0; line-height: 1.3; overflow-wrap: anywhere; }
	.wrn-toast-dismiss {
		display: inline-grid; place-items: center; flex: 0 0 auto;
		inline-size: 32px; block-size: 32px; margin: 0; padding: 0;
		border: 0; border-radius: var(--wrn-toast-radius, 6px);
		background: transparent; color: inherit; cursor: pointer;
		font: inherit; font-size: 18px; line-height: 1;
	}
	.wrn-toast-dismiss:hover { background: var(--wrn-toast-dismiss-hover-bg, var(--cockpit-hover-bg, rgba(0,0,0,0.08))); }
	.wrn-toast-dismiss:focus-visible { outline: 2px dashed var(--cockpit-accent, currentColor); outline-offset: 1px; }

	@media (pointer: coarse) {
		.wrn-toast { min-block-size: 52px; padding-block: 4px; }
		.wrn-toast-dismiss { inline-size: 44px; block-size: 44px; }
	}

	@media (prefers-reduced-motion: reduce) {
		.wrn-toast,
		.wrn-toast.is-dismissing { animation: none; }
	}
</style>
