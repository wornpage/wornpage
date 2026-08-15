<script lang="ts">
	interface Props {
		current?: number;
		total?: number;
		label?: string;
		onchange?: (page: number) => void;
	}

	let { current = $bindable(1), total = 1, label = 'Pagination', onchange }: Props = $props();

	let normalizedTotal = $derived(Number.isFinite(total) ? Math.max(1, Math.trunc(total)) : 1);
	let normalizedCurrent = $derived(
		Number.isFinite(current) ? Math.min(normalizedTotal, Math.max(1, Math.trunc(current))) : 1
	);

	$effect(() => {
		if (current !== normalizedCurrent) current = normalizedCurrent;
	});

	function go(page: number) {
		const target = Math.min(normalizedTotal, Math.max(1, Math.trunc(page)));
		if (target === normalizedCurrent) return;
		current = target;
		onchange?.(target);
	}

	let pages = $derived.by(() => {
		const result: (number | '…')[] = [];
		if (normalizedTotal <= 7) {
			for (let page = 1; page <= normalizedTotal; page += 1) result.push(page);
			return result;
		}

		result.push(1);
		if (normalizedCurrent > 3) result.push('…');
		const start = Math.max(2, normalizedCurrent - 1);
		const end = Math.min(normalizedTotal - 1, normalizedCurrent + 1);
		for (let page = start; page <= end; page += 1) result.push(page);
		if (normalizedCurrent < normalizedTotal - 2) result.push('…');
		result.push(normalizedTotal);
		return result;
	});
</script>

{#if normalizedTotal > 1}
	<nav class="worn-pagination" aria-label={label}>
		<button
			type="button"
			class="worn-pagination-btn worn-pagination-edge worn-pagination-prev"
			disabled={normalizedCurrent <= 1}
			onclick={() => go(normalizedCurrent - 1)}
			aria-label="Previous page"
		></button>
		<div class="worn-pagination-pages">
			{#each pages as page, i (i)}
				{#if page === '…'}
					<span class="worn-pagination-ellipsis" aria-hidden="true">…</span>
				{:else}
					<button
						type="button"
						class="worn-pagination-btn"
						aria-label={`Page ${page}`}
						aria-current={page === normalizedCurrent ? 'page' : undefined}
						onclick={() => go(page)}
					>{page}</button>
				{/if}
			{/each}
		</div>
		<span
			class="worn-pagination-status"
			role="status"
			aria-live="polite"
			aria-atomic="true"
			aria-label={`Page ${normalizedCurrent} of ${normalizedTotal}`}
		>{normalizedCurrent}/{normalizedTotal}</span>
		<button
			type="button"
			class="worn-pagination-btn worn-pagination-edge worn-pagination-next"
			disabled={normalizedCurrent >= normalizedTotal}
			onclick={() => go(normalizedCurrent + 1)}
			aria-label="Next page"
		></button>
	</nav>
{/if}

<style>
	.worn-pagination {
		box-sizing: border-box;
		container-type: inline-size;
		display: grid;
		grid-template-columns: 44px minmax(0, auto) 44px;
		align-items: center;
		justify-content: center;
		gap: 4px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin-block-start: 16px;
	}

	.worn-pagination-pages {
		display: flex;
		align-items: center;
		gap: 4px;
		min-inline-size: 0;
	}

	.worn-pagination-btn {
		box-sizing: border-box;
		min-block-size: 44px;
		min-inline-size: 44px;
		padding: 6px 12px;
		border: 1px solid var(--cockpit-border, #cfd5d1);
		border-radius: var(--cockpit-radius-sm, 6px);
		background: var(--cockpit-surface, #ffffff);
		color: var(--cockpit-text-muted, #506058);
		font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
		font-size: 13px;
		font-weight: 560;
		text-align: center;
		cursor: pointer;
		touch-action: manipulation;
		transition: background-color 0.12s ease, color 0.12s ease;
	}

	.worn-pagination-edge {
		position: relative;
		padding: 0;
	}

	.worn-pagination-edge::before {
		position: absolute;
		inset-inline-start: 50%;
		inset-block-start: 50%;
		box-sizing: border-box;
		inline-size: 7px;
		block-size: 7px;
		border-inline-end: 1.5px solid currentColor;
		border-block-end: 1.5px solid currentColor;
		content: '';
		translate: -50% -50%;
	}

	.worn-pagination-prev::before {
		transform: rotate(135deg);
	}

	.worn-pagination-next::before {
		transform: rotate(-45deg);
	}

	.worn-pagination-btn:hover:not(:disabled) {
		background: var(--cockpit-accent-50, #e5f2ef);
		color: var(--cockpit-text, #1f2f28);
	}

	.worn-pagination-btn:focus-visible {
		outline: 2px dashed var(--cockpit-accent, #287f73);
		outline-offset: 2px;
	}

	.worn-pagination-btn[aria-current='page'] {
		border-color: var(--cockpit-accent, #287f73);
		background: var(--cockpit-accent, #287f73);
		color: var(--cockpit-accent-text, #ffffff);
	}

	.worn-pagination-btn:disabled {
		border-color: var(--cockpit-border, #cfd5d1);
		background: var(--cockpit-bg-secondary, #f3f5f4);
		color: var(--cockpit-text-muted, #506058);
		cursor: not-allowed;
	}

	.worn-pagination-ellipsis,
	.worn-pagination-status {
		box-sizing: border-box;
		color: var(--cockpit-text-muted, #506058);
		font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
		font-size: 13px;
		font-weight: 560;
	}

	.worn-pagination-ellipsis {
		padding: 6px 4px;
	}

	.worn-pagination-status {
		display: none;
		align-items: center;
		justify-content: center;
		min-block-size: 44px;
		min-inline-size: 0;
		white-space: nowrap;
	}

	@container (max-width: 439px) {
		.worn-pagination-pages {
			display: none;
		}

		.worn-pagination-status {
			display: inline-flex;
		}
	}

	@container (max-width: 167px) {
		.worn-pagination-status {
			font-size: 12px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-pagination-btn {
			transition: none;
		}
	}
</style>
