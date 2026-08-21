<script lang="ts">
	interface Props {
		lines?: number;
		width?: 'full' | 'half' | 'third';
		children?: any;
		loading?: boolean;
	}

	let { lines = 3, width = 'full', children, loading = true }: Props = $props();
</script>

{#if loading}
	<div class="worn-skeleton" class:is-half={width === 'half'} class:is-third={width === 'third'} role="status" aria-busy="true" aria-label="Loading">
		<div class="worn-skeleton-line worn-skeleton-line--1"></div>
		{#if lines > 1}
			<div class="worn-skeleton-line worn-skeleton-line--2"></div>
		{/if}
		{#if lines > 2}
			<div class="worn-skeleton-line worn-skeleton-line--3"></div>
		{/if}
		{#if lines > 3}
			{#each { length: lines - 3 } as _}
				<div class="worn-skeleton-line"></div>
			{/each}
		{/if}
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
	.worn-skeleton {
		background: var(--cockpit-surface);
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		box-sizing: border-box;
		display: grid;
		gap: 10px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		padding: 18px 26px;
	}

	.worn-skeleton.is-half { inline-size: 50%; }
	.worn-skeleton.is-third { inline-size: 33%; }

	.worn-skeleton-line {
		animation: worn-shimmer 1.6s ease-in-out infinite;
		background-image: linear-gradient(
			90deg,
			var(--cockpit-border) 0%,
			var(--cockpit-surface) 40%,
			var(--cockpit-border) 80%
		);
		background-size: 200% 100%;
		border-radius: 4px;
		height: 14px;
		max-inline-size: 100%;
		width: 100%;
	}

	.worn-skeleton-line--1 { width: 70%; }
	.worn-skeleton-line--2 { width: 88%; }
	.worn-skeleton-line--3 { width: 52%; }

	@keyframes worn-shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-skeleton-line { animation: none; }
	}
</style>
