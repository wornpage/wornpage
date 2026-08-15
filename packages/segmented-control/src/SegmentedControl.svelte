<script lang="ts">
	import type { SegmentedControlProps } from './types.js';

	let { options, active = $bindable(''), name, label, onchange }: SegmentedControlProps = $props();
	const instanceId = $props.id();
	let radioName = $derived(`${name}-${instanceId}`);

	$effect(() => {
		if (!active && options.length) active = options[0].id;
	});
</script>

<div class="worn-segmented" role="radiogroup" aria-label={label || name}>
	<input type="hidden" {name} value={active} />
	{#each options as option (option.id)}
		<label class="worn-segment" class:active={active === option.id}>
			<input
				type="radio"
				name={radioName}
				value={option.id}
				checked={active === option.id}
				onchange={() => {
					active = option.id;
					onchange?.(option.id);
				}}
			/>
			<span>{option.label}</span>
		</label>
	{/each}
</div>

<style>
	.worn-segmented {
		display: flex;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		box-sizing: border-box;
		border: 1px solid var(--cockpit-border);
		border-radius: var(--cockpit-radius);
		overflow: hidden;
	}

	.worn-segment {
		position: relative;
		flex: 1 1 0;
		min-inline-size: 0;
		min-block-size: 44px;
		cursor: pointer;
		touch-action: manipulation;
	}

	.worn-segment input[type='radio'] {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		margin: 0;
		opacity: 0;
		cursor: inherit;
	}

	.worn-segment span {
		display: flex;
		align-items: center;
		justify-content: center;
		inline-size: 100%;
		min-inline-size: 0;
		min-block-size: 44px;
		box-sizing: border-box;
		padding: 6px 2px;
		font-family: var(--font-typewriter);
		font-size: 12px;
		font-weight: 560;
		line-height: 1.2;
		text-align: center;
		overflow-wrap: anywhere;
		color: var(--cockpit-text-muted);
		background: var(--cockpit-surface);
		transition: background 0.12s, color 0.12s;
	}

	.worn-segment.active span {
		background: var(--cockpit-accent);
		color: var(--cockpit-accent-text);
	}

	.worn-segment input:focus-visible + span {
		outline: 2px dashed var(--cockpit-accent);
		outline-offset: -3px;
	}

	.worn-segment:not(.active):hover span {
		background: var(--cockpit-accent-50);
		color: var(--cockpit-text);
	}

	.worn-segment + .worn-segment {
		border-inline-start: 1px solid var(--cockpit-border);
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-segment span {
			transition: none;
		}
	}
</style>
