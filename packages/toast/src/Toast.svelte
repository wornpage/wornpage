<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import type { ToastProps } from './types.js';

	let { message, kind = 'info', ondismiss, duration = 3000 }: ToastProps = $props();

	let visible = $state(true);

	function dismiss() {
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
	<button type="button" class="wrn-toast" class:is-error={kind === 'error'} class:is-success={kind === 'success'}
		in:fly={{ x: 120, duration: 220 }}
		out:fade={{ duration: 180 }}
		onclick={dismiss}
	>
		<span class="wrn-toast-icon">{kind === 'error' ? '✗' : kind === 'success' ? '✓' : '→'}</span>
		<span class="wrn-toast-text">{message}</span>
	</button>
{/if}

<style>
	.wrn-toast {
		display: flex; align-items: flex-start; gap: 8px;
		background: var(--wrn-toast-bg, #fdfbf7);
		border: 1px solid var(--wrn-toast-border, #e2ddd5);
		border-radius: var(--wrn-toast-radius, 6px);
		padding: 10px 14px;
		font-family: var(--wrn-toast-font, inherit);
		font-size: 13px; font-weight: 600;
		color: var(--wrn-toast-text, #21322b);
		cursor: pointer; text-align: start; width: 100%;
		box-sizing: border-box;
		box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
		position: relative; overflow: hidden;
	}
	.wrn-toast.is-error { border-color: var(--wrn-toast-error-border, #e74c3c); background: var(--wrn-toast-error-bg, #fdf0ef); }
	.wrn-toast.is-success { border-color: var(--wrn-toast-success-border, #27ae60); background: var(--wrn-toast-success-bg, #edf9f0); }
	.wrn-toast-icon { font-size: 14px; line-height: 1; flex-shrink: 0; }
	.wrn-toast.is-error .wrn-toast-icon { color: var(--wrn-toast-error-text, #e74c3c); }
	.wrn-toast.is-success .wrn-toast-icon { color: var(--wrn-toast-success-text, #27ae60); }
	.wrn-toast-text { flex: 1; min-width: 0; line-height: 1.3; }
</style>
