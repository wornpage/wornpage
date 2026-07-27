<script lang="ts">
	import type { ThemeName } from './types.js';
	import { applyTheme, THEMES, resolveTheme } from './types.js';

	let { theme = $bindable('system' as ThemeName) }: { theme?: ThemeName } = $props();

	function handleChange(newTheme: ThemeName) {
		theme = newTheme;
		applyTheme(newTheme);
	}

	// Follow OS changes while on system theme
	$effect(() => {
		if (theme !== 'system') return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => applyTheme('system');
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	// Apply on mount
	$effect(() => {
		try {
			const saved = localStorage.getItem('wrn-theme') as ThemeName | null;
			if (saved && THEMES.includes(saved as any)) {
				theme = saved;
				applyTheme(saved);
				return;
			}
		} catch {}
		applyTheme(theme);
	});
</script>

{#each THEMES as t (t)}
	{@const label = { system: 'System', light: 'Light', dark: 'Dark', forest: 'Forest', ocean: 'Ocean', sepia: 'Sepia', halloween: 'Halloween', winter: 'Winter', holiday: 'Holiday' }[t] ?? t}
	<button type="button" class="wrn-theme-btn" class:is-active={theme === t} onclick={() => handleChange(t)}>{label}</button>
{/each}

<style>
	.wrn-theme-btn {
		padding: 6px 14px; border: 1px solid var(--wrn-theme-border, #e2ddd5);
		border-radius: var(--wrn-theme-radius, 6px);
		background: var(--wrn-theme-btn-bg, transparent);
		color: var(--wrn-theme-text, #21322b);
		cursor: pointer; font-size: 13px;
		min-height: 36px;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
	}
	.wrn-theme-btn:hover { background: var(--wrn-theme-hover, #eaf4f0); }
	.wrn-theme-btn.is-active { background: var(--wrn-theme-active-bg, #0d9488); color: var(--wrn-theme-active-text, #fff); border-color: var(--wrn-theme-active-bg, #0d9488); }
</style>
