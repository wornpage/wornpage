<script lang="ts">
	export interface NavigationListItem {
		label: string;
		href: string;
		description?: string;
		current?: boolean;
	}

	interface Props {
		items: readonly NavigationListItem[];
		label?: string;
	}

	let { items, label = 'Navigation' }: Props = $props();
</script>

{#if items.length > 0}
	<nav class="worn-navigation-list" aria-label={label} data-worn-navigation-list>
		<ul>
			{#each items as item (item.href)}
				<li>
					<a href={item.href} aria-current={item.current ? 'page' : undefined}>
						<span class="worn-navigation-list-label">{item.label}</span>
						{#if item.description}
							<span class="worn-navigation-list-description">{item.description}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.worn-navigation-list {
		box-sizing: border-box;
		container-type: inline-size;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	ul {
		box-sizing: border-box;
		display: grid;
		gap: 1px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin: 0;
		padding: 1px;
		list-style: none;
		background: var(--worn-navigation-list-divider, var(--cockpit-border, #cfd5d1));
		border-radius: var(--worn-navigation-list-radius, var(--cockpit-radius-sm, 6px));
	}

	li {
		box-sizing: border-box;
		display: flex;
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	a {
		box-sizing: border-box;
		display: grid;
		align-content: center;
		gap: 2px;
		inline-size: 100%;
		max-inline-size: 100%;
		min-block-size: 52px;
		min-inline-size: 0;
		padding: 8px 12px;
		background: var(--worn-navigation-list-background, var(--cockpit-surface, #ffffff));
		color: var(--cockpit-text, #1f2f28);
		text-decoration: none;
		touch-action: manipulation;
		transition: background-color 0.12s ease, color 0.12s ease;
	}

	.worn-navigation-list-label,
	.worn-navigation-list-description {
		box-sizing: border-box;
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.worn-navigation-list-label {
		font-size: 14px;
		font-weight: 650;
		line-height: 1.35;
	}

	.worn-navigation-list-description {
		color: var(--cockpit-text-muted, #506058);
		font-size: 12px;
		line-height: 1.4;
	}

	a:hover {
		background: var(--worn-navigation-list-hover, var(--cockpit-accent-50, #e5f2ef));
	}

	a:focus-visible {
		outline: 2px dashed var(--cockpit-accent, #287f73);
		outline-offset: -3px;
		position: relative;
		z-index: 1;
	}

	a[aria-current='page'] {
		background: var(--cockpit-selected-bg, var(--cockpit-accent-50, #e5f2ef));
		color: var(--cockpit-selected-fg, var(--cockpit-text, #1f2f28));
	}

	@container (min-width: 520px) {
		ul {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		ul {
			background: CanvasText;
		}

		a {
			background: Canvas;
			color: CanvasText;
		}

		a:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
