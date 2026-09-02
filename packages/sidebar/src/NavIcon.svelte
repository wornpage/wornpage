<script lang="ts">
	import type { NavIcon } from './types.js';
	import { assertNavIcon } from './nav-icon.js';

	let { icon }: { icon: NavIcon } = $props();
	const validatedIcon = $derived(assertNavIcon(icon));
</script>

<span class="worn-nav-icon">
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox={validatedIcon.viewBox ?? '0 0 24 24'} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#each validatedIcon.shapes as shape}
			{#if shape.type === 'path'}
				<path d={shape.d}/>
			{:else if shape.type === 'circle'}
				<circle cx={shape.cx} cy={shape.cy} r={shape.r}/>
			{:else if shape.type === 'line'}
				<line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2}/>
			{:else if shape.type === 'polyline'}
				<polyline points={shape.points}/>
			{:else if shape.type === 'polygon'}
				<polygon points={shape.points}/>
			{:else}
				<rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} ry={shape.ry}/>
			{/if}
		{/each}
	</svg>
</span>

<style>
	.worn-nav-icon { flex-shrink: 0; display: flex; }
	.worn-nav-icon svg { display: block; }
</style>
