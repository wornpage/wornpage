<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { recoverKeyboardDismissFocus } from './focus-recovery';
	import type { ToastProps } from './types.js';

	let { message, kind = 'info', dismissLabel = 'Dismiss notification', ondismiss, duration = 3000 }: ToastProps = $props();

	let visible = $state(true);
	let dismissing = $state(false);
	let toastRoot = $state<HTMLElement>();
	const EXIT_DURATION_MS = 180;
	let autoDismissTimer: ReturnType<typeof setTimeout> | undefined;
	let remainingDuration = 0;
	let timerStartedAt = 0;
	let autoDismissHolds = 0;

	function clearAutoDismissTimer() {
		if (autoDismissTimer === undefined) return;
		clearTimeout(autoDismissTimer);
		autoDismissTimer = undefined;
	}

	function completeDismissal() {
		visible = false;
		ondismiss?.();
	}

	function dismiss(event?: MouseEvent) {
		if (dismissing) return;
		if (event && toastRoot) recoverKeyboardDismissFocus(event, toastRoot);
		dismissing = true;
		clearAutoDismissTimer();
		if (prefersReducedMotion.current) {
			completeDismissal();
			return;
		}
		setTimeout(completeDismissal, EXIT_DURATION_MS);
	}

	function startAutoDismissTimer() {
		clearAutoDismissTimer();
		if (duration <= 0 || autoDismissHolds > 0) return;
		if (remainingDuration <= 0) {
			dismiss();
			return;
		}
		timerStartedAt = Date.now();
		autoDismissTimer = setTimeout(() => {
			autoDismissTimer = undefined;
			remainingDuration = 0;
			dismiss();
		}, remainingDuration);
	}

	function pauseAutoDismiss() {
		autoDismissHolds += 1;
		if (autoDismissTimer === undefined) return;
		clearAutoDismissTimer();
		remainingDuration -= Date.now() - timerStartedAt;
		remainingDuration = Math.max(0, remainingDuration);
	}

	function resumeAutoDismiss() {
		autoDismissHolds = Math.max(0, autoDismissHolds - 1);
		if (autoDismissHolds === 0 && !dismissing) startAutoDismissTimer();
	}

	function handleFocusOut(event: FocusEvent) {
		const element = event.currentTarget as HTMLElement;
		if (element.contains(event.relatedTarget as Node | null)) return;
		resumeAutoDismiss();
	}

	$effect(() => {
		remainingDuration = duration;
		startAutoDismissTimer();
		return clearAutoDismissTimer;
	});
</script>

{#if visible}
	<div bind:this={toastRoot} class="wrn-toast" class:is-error={kind === 'error'} class:is-success={kind === 'success'} class:is-dismissing={dismissing}
		role={kind === 'error' ? 'alert' : 'status'}
		aria-live={kind === 'error' ? 'assertive' : 'polite'}
		aria-atomic="true"
		onpointerenter={pauseAutoDismiss}
		onpointerleave={resumeAutoDismiss}
		onfocusin={pauseAutoDismiss}
		onfocusout={handleFocusOut}
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
		background: var(--wrn-toast-bg, var(--worn-surface, #fdfbf7));
		border: 1px solid var(--wrn-toast-border, var(--worn-border, #e2ddd5));
		border-radius: var(--wrn-toast-radius, 6px);
		min-block-size: 44px;
		padding: 6px 8px 6px 14px;
		font-family: var(--wrn-toast-font, inherit);
		font-size: 13px; font-weight: 600;
		color: var(--wrn-toast-text, var(--worn-text, #21322b));
		text-align: start; width: 100%; max-inline-size: 100%; min-inline-size: 0;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
		position: relative; overflow: hidden;
		animation: wrn-toast-enter 220ms ease-out;
	}
	.wrn-toast.is-dismissing { animation: wrn-toast-exit 180ms ease-in forwards; pointer-events: none; }
	.wrn-toast.is-error {
		border-color: var(--wrn-toast-error-border, var(--worn-danger-border, #e74c3c));
		background: var(--wrn-toast-error-bg, var(--worn-danger-bg, var(--wrn-toast-bg, var(--worn-surface, #fdf0ef))));
		color: var(--wrn-toast-error-text, var(--worn-danger-text, var(--wrn-toast-text, var(--worn-text, #21322b))));
	}
	.wrn-toast.is-success {
		border-color: var(--wrn-toast-success-border, var(--worn-success-border, #27ae60));
		background: var(--wrn-toast-success-bg, var(--worn-success-bg, var(--wrn-toast-bg, var(--worn-surface, #edf9f0))));
		color: var(--wrn-toast-success-text, var(--worn-success-text, var(--wrn-toast-text, var(--worn-text, #21322b))));
	}
	.wrn-toast-icon { font-size: 14px; line-height: 1; flex-shrink: 0; }
	.wrn-toast-text { flex: 1; max-inline-size: 100%; min-width: 0; line-height: 1.3; overflow-wrap: anywhere; }
	.wrn-toast-dismiss {
		display: inline-grid; place-items: center; flex: 0 0 auto;
		inline-size: 32px; block-size: 32px; margin: 0; padding: 0;
		border: 0; border-radius: var(--wrn-toast-radius, 6px);
		background: transparent; color: inherit; cursor: pointer;
		font: inherit; font-size: 18px; line-height: 1;
	}
	.wrn-toast-dismiss:hover { background: var(--wrn-toast-dismiss-hover-bg, var(--worn-hover-bg, rgba(0,0,0,0.08))); }
	.wrn-toast-dismiss:focus-visible { outline: 2px dashed var(--wrn-toast-focus, var(--worn-focus, var(--worn-accent, currentColor))); outline-offset: 1px; }

	@media (pointer: coarse) {
		.wrn-toast { min-block-size: 52px; padding-block: 4px; }
		.wrn-toast-dismiss { inline-size: 44px; block-size: 44px; }
	}

	@media (prefers-reduced-motion: reduce) {
		.wrn-toast,
		.wrn-toast.is-dismissing { animation: none; }
	}
</style>
