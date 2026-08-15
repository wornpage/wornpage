<script lang="ts">
	import { Button } from '@wornpage/button';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';

	interface Props {
		message?: string;
		detail?: string;
		onretry?: () => void | Promise<void>;
		children?: any;
	}

	let { message = 'Something went wrong', detail, onretry, children }: Props = $props();
	let busy = $state(false);

	async function retry() {
		busy = true;
		try {
			await onretry?.();
		} catch (error) {
			console.warn('Retry failed:', error);
		} finally {
			busy = false;
		}
	}
</script>

<div class="worn-error" role="alert" aria-busy={busy} in:fly={{ y: prefersReducedMotion.current ? 0 : 12, duration: prefersReducedMotion.current ? 0 : 250 }}>
	<strong>{message}</strong>
	{#if detail}<span>{detail}</span>{/if}
	{@render children?.()}
	{#if onretry}
		<Button variant="primary" size="sm" onclick={retry} disabled={busy}>
			{busy ? 'Retrying…' : 'Retry'}
		</Button>
	{/if}
</div>

<style>
	.worn-error {
		background: var(--cockpit-danger-bg);
		border: 1px solid var(--cockpit-danger-border);
		border-radius: var(--cockpit-radius);
		box-sizing: border-box;
		color: var(--cockpit-danger-text);
		display: grid;
		font-family: var(--font-typewriter);
		gap: 8px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		padding: 22px;
	}

	.worn-error > * {
		min-inline-size: 0;
	}

	.worn-error strong {
		color: var(--cockpit-danger-text);
		display: block;
	}

	.worn-error span {
		color: var(--cockpit-text-secondary);
		display: block;
		font-size: 13px;
	}
</style>
