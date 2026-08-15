<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { activateModalLayer, portal } from './modal-layer';
	import type { DrawerProps } from './types';

	let { open = $bindable(false), side = 'end', title, onclose, children }: DrawerProps = $props();

	const componentId = $props.id();
	const titleId = `worn-drawer-title-${componentId}`;
	let drawerEl = $state<HTMLElement | null>(null);
	let backdropEl = $state<HTMLElement | null>(null);

	// Keep modal isolation, scroll state, and focus restoration in one lifecycle.
	$effect(() => {
		if (!open || !drawerEl || !backdropEl || typeof document === 'undefined') return;
		const previous = document.activeElement as HTMLElement | null;
		const activeDrawer = drawerEl;
		const releaseModalLayer = activateModalLayer(backdropEl);
		drawerEl.focus();

		return () => {
			releaseModalLayer();
			const current = document.activeElement;
			if (previous?.isConnected && (current === document.body || activeDrawer.contains(current))) {
				previous.focus({ preventScroll: true });
			}
		};
	});

	function focusables(): HTMLElement[] {
		if (!drawerEl) return [];
		return Array.from(
			drawerEl.querySelectorAll<HTMLElement>(
				'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])'
			)
		).filter((item) => !item.closest('[inert]') && item.getClientRects().length > 0 && getComputedStyle(item).visibility !== 'hidden');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			open = false;
			onclose?.();
			return;
		}
		if (e.key === 'Tab') {
			const items = focusables();
			if (!items.length) {
				e.preventDefault();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
			if (e.shiftKey && (activeEl === first || activeEl === drawerEl)) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && activeEl === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) { open = false; onclose?.(); }
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div bind:this={backdropEl} use:portal class="worn-drawer-backdrop" role="presentation" transition:fade={{ duration: prefersReducedMotion.current ? 0 : 200 }} onclick={handleBackdrop}>
		<div
			class="worn-drawer"
			class:is-end={side === 'end'}
			class:is-start={side === 'start'}
			class:is-bottom={side === 'bottom'}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? titleId : undefined}
			tabindex="-1"
			bind:this={drawerEl}
			transition:fly={{
				x: prefersReducedMotion.current || side === 'bottom' ? 0 : side === 'start' ? -280 : 280,
				y: prefersReducedMotion.current ? 0 : side === 'bottom' ? 280 : 0,
				duration: prefersReducedMotion.current ? 0 : 320,
				opacity: 1
			}}
		>
			<div class="worn-drawer-head">
				{#if title}<h2 class="worn-drawer-title" id={titleId}>{title}</h2>{/if}
				<button type="button" class="worn-drawer-close" onclick={() => { open = false; onclose?.(); }} aria-label="Close"></button>
			</div>
			<div class="worn-drawer-body">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.worn-drawer-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		width: var(--worn-visual-viewport-width, 100vw);
		height: 100vh;
		height: 100dvh;
		height: var(--worn-visual-viewport-height, 100dvh);
		transform: translate(
			var(--worn-visual-viewport-left, 0px),
			var(--worn-visual-viewport-top, 0px)
		);
		box-sizing: border-box;
		z-index: 1000;
		background: rgba(0,0,0,0.25);
		backdrop-filter: blur(1.5px);
		overflow: hidden;
	}
	.worn-drawer {
		box-sizing: border-box;
		position: absolute;
		background: var(--cockpit-surface);
		border: 1px solid var(--cockpit-border);
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		width: min(380px, calc(100% - 32px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)));
		min-width: 0;
		max-height: calc(100% - 32px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
		overflow-y: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		padding: 20px;
	}
	.worn-drawer.is-end {
		top: calc(16px + env(safe-area-inset-top, 0px));
		bottom: calc(16px + env(safe-area-inset-bottom, 0px));
		right: calc(16px + env(safe-area-inset-right, 0px));
		border-radius: var(--cockpit-radius) 0 0 var(--cockpit-radius);
	}
	.worn-drawer.is-start {
		top: calc(16px + env(safe-area-inset-top, 0px));
		bottom: calc(16px + env(safe-area-inset-bottom, 0px));
		left: calc(16px + env(safe-area-inset-left, 0px));
		border-radius: 0 var(--cockpit-radius) var(--cockpit-radius) 0;
	}
	.worn-drawer.is-bottom {
		left: calc(16px + env(safe-area-inset-left, 0px));
		right: calc(16px + env(safe-area-inset-right, 0px));
		bottom: calc(16px + env(safe-area-inset-bottom, 0px));
		max-height: calc(60% - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
		width: auto;
		border-radius: var(--cockpit-radius) var(--cockpit-radius) 0 0;
	}
	.worn-drawer-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}
	.worn-drawer-title {
		font-family: var(--font-family-display);
		font-size: 18px;
		font-weight: 680;
		color: var(--cockpit-text);
		margin: 0;
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.worn-drawer-close {
		position: relative;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 0;
		background: transparent;
		color: var(--cockpit-text-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		touch-action: manipulation;
	}
	.worn-drawer-close::before,
	.worn-drawer-close::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 12px;
		height: 1.5px;
		border-radius: 1px;
		background: currentColor;
	}
	.worn-drawer-close::before { transform: translate(-50%, -50%) rotate(45deg); }
	.worn-drawer-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
	.worn-drawer-close:hover { background: var(--cockpit-hover-bg); }
	.worn-drawer-close:focus-visible {
		outline: 2px dashed var(--cockpit-accent);
		outline-offset: 2px;
	}
	.worn-drawer-body {
		box-sizing: border-box;
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
		overflow-wrap: anywhere;
	}
</style>
