<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { ToastProps } from './types.js';

	let { message, kind = 'info', ondismiss, duration = 3000 }: ToastProps = $props();

	let visible = $state(true);
	let dismissing = false;

	function dismiss() {
		if (dismissing) return;
		dismissing = true;
		visible = false;
		setTimeout(() => ondismiss?.(), 200);
	}

	$effect(() => {
		if (duration <= 0) return;
		const timer = setTimeout(() => dismiss(), duration);
		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div class="wrn-toast" class:is-error={kind === 'error'} class:is-success={kind === 'success'}
		role={kind === 'error' ? 'alert' : 'status'}
		aria-live={kind === 'error' ? 'assertive' : 'polite'}
		aria-atomic="true"
		in:fly={{ x: 120, duration: 220 }}
		out:fade={{ duration: 180 }}
	>
		<span class="wrn-toast-icon" aria-hidden="true">{kind === 'error' ? '✗' : kind === 'success' ? '✓' : '→'}</span>
		<span class="wrn-toast-text">{message}</span>
		<button type="button" class="wrn-toast-dismiss" onclick={dismiss} aria-label="Dismiss notification">&times;</button>
	</div>
{/if}

<style>
	.wrn-toast {
		display: flex; align-items: center; gap: 8px;
		background: var(--wrn-toast-bg, var(--cockpit-surface, #fdfbf7));
		border: 1px solid var(--wrn-toast-border, var(--cockpit-border, #e2ddd5));
		border-radius: var(--wrn-toast-radius, 6px);
		padding: 10px 14px;
		font-family: var(--wrn-toast-font, inherit);
		font-size: 13px; font-weight: 600;
		color: var(--wrn-toast-text, var(--cockpit-text, #21322b));
		text-align: start; width: 100%;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
		position: relative; overflow: hidden;
	}
	.wrn-toast.is-error { border-color: var(--wrn-toast-error-border, var(--cockpit-danger-border, #e74c3c)); background: var(--wrn-toast-error-bg, var(--cockpit-danger-bg, #fdf0ef)); }
	.wrn-toast.is-success { border-color: var(--wrn-toast-success-border, var(--cockpit-success-border, #27ae60)); background: var(--wrn-toast-success-bg, var(--cockpit-success-bg, #edf9f0)); }
	.wrn-toast-icon { font-size: 14px; line-height: 1; flex-shrink: 0; }
	.wrn-toast.is-error .wrn-toast-icon { color: var(--wrn-toast-error-text, var(--cockpit-danger-text, #e74c3c)); }
	.wrn-toast.is-success .wrn-toast-icon { color: var(--wrn-toast-success-text, var(--cockpit-success-text, #27ae60)); }
	.wrn-toast-text { flex: 1; min-width: 0; line-height: 1.3; }
	.wrn-toast-dismiss {
		display: inline-grid; place-items: center; flex: 0 0 auto;
		inline-size: 28px; block-size: 28px; margin: -4px -8px -4px 0; padding: 0;
		border: 0; border-radius: var(--wrn-toast-radius, 6px);
		background: transparent; color: inherit; cursor: pointer;
		font: inherit; font-size: 18px; line-height: 1;
	}
	.wrn-toast-dismiss:hover { background: var(--wrn-toast-dismiss-hover-bg, var(--cockpit-hover-bg, rgba(0,0,0,0.08))); }
	.wrn-toast-dismiss:focus-visible { outline: 2px dashed var(--cockpit-accent, currentColor); outline-offset: 1px; }
</style>
