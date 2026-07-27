export const THEMES = ['system', 'light', 'dark', 'forest', 'ocean', 'sepia', 'halloween', 'winter', 'holiday'] as const;
export const THEME_LABELS: Record<string, string> = {
	light: 'Light', dark: 'Dark', forest: 'Forest', ocean: 'Ocean', sepia: 'Sepia',
	system: 'System', halloween: 'Halloween', winter: 'Winter', holiday: 'Holiday',
};

export type ThemeName = (typeof THEMES)[number];

export function resolveTheme(theme: ThemeName): string {
	if (theme !== 'system') return theme;
	try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch { return 'light'; }
}

export function applyTheme(theme: ThemeName): void {
	const effective = resolveTheme(theme);
	document.documentElement.setAttribute('data-theme', effective);
	try { localStorage.setItem('wrn-theme', theme); } catch {}
}
