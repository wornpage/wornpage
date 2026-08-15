<script lang="ts">
	import { onMount } from 'svelte';
	import {
		THEMES,
		THEME_LABELS,
		createThemeController,
		type EffectiveTheme,
		type ThemeController,
		type ThemeName,
	} from './types.js';

	let {
		theme = $bindable('system' as ThemeName),
		storageKey = 'wrn-theme',
		themes = THEMES,
		onchange,
	}: {
		theme?: ThemeName;
		storageKey?: string;
		themes?: readonly ThemeName[];
		onchange?: (theme: ThemeName, effectiveTheme: EffectiveTheme) => void;
	} = $props();

	let controller: ThemeController | undefined;

	onMount(() => {
		controller = createThemeController({
			initialTheme: theme,
			storageKey,
			themes,
			onApply(nextTheme, effectiveTheme) {
				theme = nextTheme;
				onchange?.(nextTheme, effectiveTheme);
			},
		});
		return controller.start();
	});

	$effect(() => {
		if (controller && controller.current !== theme) controller.set(theme);
	});

	function handleChange(nextTheme: ThemeName) {
		if (controller) controller.set(nextTheme);
		else theme = nextTheme;
	}
</script>

<div class="wrn-theme-group" role="group" aria-label="Theme">
	{#each themes as option (option)}
		<button
			type="button"
			class="wrn-theme-btn"
			class:is-active={theme === option}
			aria-pressed={theme === option}
			onclick={() => handleChange(option)}
		>{THEME_LABELS[option]}</button>
	{/each}
</div>

<style>
	.wrn-theme-group {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.wrn-theme-btn {
		min-height: 36px;
		padding: 6px 14px;
		border: 1px solid var(--wrn-theme-border, #e2ddd5);
		border-radius: var(--wrn-theme-radius, 6px);
		background: var(--wrn-theme-btn-bg, transparent);
		color: var(--wrn-theme-text, #21322b);
		cursor: pointer;
		font-size: 13px;
		letter-spacing: 0;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
	}
	.wrn-theme-btn:hover { background: var(--wrn-theme-hover, #eaf4f0); }
	.wrn-theme-btn:focus-visible { outline: 2px solid var(--wrn-theme-focus, #0d9488); outline-offset: 2px; }
	.wrn-theme-btn.is-active { background: var(--wrn-theme-active-bg, #0d9488); color: var(--wrn-theme-active-text, #fff); border-color: var(--wrn-theme-active-bg, #0d9488); }
	@media (pointer: coarse) {
		.wrn-theme-btn { min-height: 44px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.wrn-theme-btn { transition: none; }
	}
</style>
