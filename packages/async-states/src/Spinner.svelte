<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		type?: 'ring' | 'dots' | 'blob';
		size?: 'sm' | 'md';
		label?: string;
		variant?: 'default' | 'accent';
		announce?: boolean;
	}

	let { type = 'ring', size = 'md', label = 'Loading…', variant = 'default', announce = true }: Props = $props();
</script>

<div
	class="worn-spinner"
	class:is-sm={size === 'sm'}
	class:is-accent={variant === 'accent'}
	role={announce ? 'status' : undefined}
	aria-live={announce ? 'polite' : undefined}
	aria-atomic={announce ? 'true' : undefined}
	aria-hidden={announce ? undefined : 'true'}
>
	{#if type === 'dots'}
		<div class="worn-spinner-dots">
			<span class="worn-spinner-dot"></span>
			<span class="worn-spinner-dot"></span>
			<span class="worn-spinner-dot"></span>
		</div>
	{:else if type === 'blob'}
		<div class="worn-spinner-blob">
			<svg viewBox="0 0 40 40" class="worn-spinner-blob-svg">
				<circle cx="20" cy="20" r="16" fill="currentColor">
					{#if !prefersReducedMotion.current}
						<animate attributeName="r" values="16;10;16" dur="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1"/>
						<animate attributeName="cy" values="20;24;20" dur="1.2s" repeatCount="indefinite"/>
					{/if}
				</circle>
			</svg>
		</div>
	{:else}
		<svg class="worn-spinner-ring" viewBox="0 0 24 24" fill="none">
			<circle cx="12" cy="12" r="10" stroke="var(--cockpit-border)" stroke-width="3" />
			<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round">
				{#if !prefersReducedMotion.current}
					<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
				{/if}
			</path>
		</svg>
	{/if}
	{#if announce}<span class="sr-only">{label}</span>{/if}
</div>

<style>
	.worn-spinner {
		align-items: center;
		color: var(--cockpit-text-muted);
		display: inline-flex;
		justify-content: center;
	}

	.worn-spinner.is-accent { color: var(--cockpit-link); }

	.worn-spinner-ring {
		height: 28px;
		width: 28px;
	}

	.worn-spinner.is-sm .worn-spinner-ring {
		height: 18px;
		width: 18px;
	}

	.worn-spinner-dots {
		display: flex;
		gap: 6px;
	}

	.worn-spinner-dot {
		animation: worn-dot-bounce 0.6s ease-in-out infinite alternate;
		background: currentColor;
		border-radius: 50%;
		height: 10px;
		width: 10px;
	}

	.worn-spinner-dot:nth-child(1) { animation-delay: 0s; }
	.worn-spinner-dot:nth-child(2) { animation-delay: 0.15s; }
	.worn-spinner-dot:nth-child(3) { animation-delay: 0.3s; }

	.worn-spinner.is-sm .worn-spinner-dots { gap: 4px; }

	.worn-spinner.is-sm .worn-spinner-dot {
		height: 6px;
		width: 6px;
	}

	@keyframes worn-dot-bounce {
		0% { transform: translateY(0) scale(0.8); opacity: 0.4; }
		100% { transform: translateY(-8px) scale(1.2); opacity: 1; }
	}

	.worn-spinner-blob-svg {
		height: 40px;
		width: 40px;
	}

	.worn-spinner.is-sm .worn-spinner-blob-svg {
		height: 24px;
		width: 24px;
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-spinner-dot { animation: none; opacity: 0.6; }
	}

	.sr-only {
		clip: rect(0, 0, 0, 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		position: absolute;
		width: 1px;
	}
</style>
