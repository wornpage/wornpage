<script lang="ts">
	export interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		items: BreadcrumbItem[];
		label?: string;
	}

	let { items, label = 'Breadcrumb' }: Props = $props();
</script>

{#if items.length > 0}
	<nav class="worn-breadcrumb" aria-label={label}>
		<ol class="worn-breadcrumb-list">
			{#each items as item, i (i)}
				<li class="worn-breadcrumb-item">
					{#if i > 0}
						<span class="worn-breadcrumb-sep" aria-hidden="true">/</span>
					{/if}
					{#if item.href && i < items.length - 1}
						<a class="worn-breadcrumb-link" href={item.href}>{item.label}</a>
					{:else if i === items.length - 1}
						<span class="worn-breadcrumb-current" aria-current="page">{item.label}</span>
					{:else}
						<span class="worn-breadcrumb-text">{item.label}</span>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.worn-breadcrumb,
	.worn-breadcrumb-list,
	.worn-breadcrumb-item {
		box-sizing: border-box;
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	.worn-breadcrumb {
		inline-size: 100%;
	}

	.worn-breadcrumb-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
		inline-size: 100%;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.worn-breadcrumb-item {
		display: flex;
		align-items: baseline;
		flex: 0 1 auto;
		gap: 6px;
	}

	.worn-breadcrumb-sep {
		flex: 0 0 auto;
		color: var(--cockpit-text-muted, #506058);
		font-size: 12px;
	}

	.worn-breadcrumb-link,
	.worn-breadcrumb-current,
	.worn-breadcrumb-text {
		box-sizing: border-box;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
		font-family: var(--font-typewriter, ui-monospace, SFMono-Regular, Consolas, monospace);
		font-size: 13px;
	}

	.worn-breadcrumb-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-block-size: 44px;
		min-inline-size: 44px;
		font-weight: 520;
		color: var(--cockpit-text-muted, #506058);
		text-align: center;
		text-decoration: none;
		touch-action: manipulation;
		transition: color 0.12s ease;
	}

	.worn-breadcrumb-current {
		font-weight: 600;
		color: var(--cockpit-text, #1f2f28);
	}

	.worn-breadcrumb-text {
		font-weight: 520;
		color: var(--cockpit-text-muted, #506058);
	}

	.worn-breadcrumb-link:hover {
		color: var(--cockpit-link, var(--cockpit-accent, #287f73));
	}

	.worn-breadcrumb-link:focus-visible {
		outline: 2px dashed var(--cockpit-accent, #287f73);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-breadcrumb-link {
			transition: none;
		}
	}
</style>
