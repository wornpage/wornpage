export const THEMES = ['system', 'light', 'dark', 'forest', 'ocean', 'sepia', 'halloween', 'winter', 'holiday'] as const;

export type ThemeName = (typeof THEMES)[number];
export type EffectiveTheme = Exclude<ThemeName, 'system'>;

export const THEME_LABELS: Record<ThemeName, string> = {
	system: 'System',
	light: 'Light',
	dark: 'Dark',
	forest: 'Forest',
	ocean: 'Ocean',
	sepia: 'Sepia',
	halloween: 'Halloween',
	winter: 'Winter',
	holiday: 'Holiday',
};

export interface ThemeRoot {
	setAttribute(name: string, value: string): void;
}

export interface ThemeStorage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export interface ThemeMediaQuery {
	readonly matches: boolean;
	addEventListener(type: 'change', listener: () => void): void;
	removeEventListener(type: 'change', listener: () => void): void;
}

export type ThemeMatchMedia = (query: string) => ThemeMediaQuery;

export interface ThemeRuntimeOptions {
	storageKey?: string;
	themes?: readonly ThemeName[];
	root?: ThemeRoot | null;
	storage?: ThemeStorage | null;
	matchMedia?: ThemeMatchMedia | null;
}

export interface ApplyThemeOptions extends ThemeRuntimeOptions {
	persist?: boolean;
	onApply?: (theme: ThemeName, effectiveTheme: EffectiveTheme) => void;
}

export interface ThemeControllerOptions extends ThemeRuntimeOptions {
	initialTheme?: ThemeName;
	onApply?: (theme: ThemeName, effectiveTheme: EffectiveTheme) => void;
}

export interface ThemeController {
	readonly current: ThemeName;
	set(theme: ThemeName): EffectiveTheme;
	restore(): ThemeName;
	start(): () => void;
	stop(): void;
}

function defaultRoot(): ThemeRoot | null {
	return typeof document === 'undefined' ? null : document.documentElement;
}

function defaultStorage(): ThemeStorage | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

function defaultMatchMedia(): ThemeMatchMedia | null {
	return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
		? null
		: window.matchMedia.bind(window);
}

function runtime<T>(value: T | null | undefined, fallback: () => T | null): T | null {
	return value === undefined ? fallback() : value;
}

export function isThemeName(value: unknown, themes: readonly ThemeName[] = THEMES): value is ThemeName {
	return typeof value === 'string' && themes.includes(value as ThemeName);
}

export function readTheme(options: ThemeRuntimeOptions = {}): ThemeName | null {
	const storage = runtime(options.storage, defaultStorage);
	if (!storage) return null;
	try {
		const saved = storage.getItem(options.storageKey ?? 'wrn-theme');
		return isThemeName(saved, options.themes ?? THEMES) ? saved : null;
	} catch {
		return null;
	}
}

export function resolveTheme(theme: ThemeName, matchMedia?: ThemeMatchMedia | null): EffectiveTheme {
	if (theme !== 'system') return theme;
	const media = runtime(matchMedia, defaultMatchMedia);
	try {
		return media?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

export function applyTheme(theme: ThemeName, options: ApplyThemeOptions = {}): EffectiveTheme {
	const themes = options.themes ?? THEMES;
	if (!isThemeName(theme, themes)) throw new TypeError(`Unknown theme: ${String(theme)}`);

	const matchMedia = runtime(options.matchMedia, defaultMatchMedia);
	const effectiveTheme = resolveTheme(theme, matchMedia);
	const root = runtime(options.root, defaultRoot);
	root?.setAttribute('data-theme', effectiveTheme);

	if (options.persist !== false) {
		const storage = runtime(options.storage, defaultStorage);
		try {
			storage?.setItem(options.storageKey ?? 'wrn-theme', theme);
		} catch {}
	}

	options.onApply?.(theme, effectiveTheme);
	return effectiveTheme;
}

export function createThemeController(options: ThemeControllerOptions = {}): ThemeController {
	const themes = options.themes ?? THEMES;
	if (!isThemeName(options.initialTheme ?? 'system', themes)) {
		throw new TypeError(`Unknown initial theme: ${String(options.initialTheme)}`);
	}

	let current = options.initialTheme ?? 'system';
	let mediaQuery: ThemeMediaQuery | null = null;
	let started = false;
	const matchMedia = runtime(options.matchMedia, defaultMatchMedia);
	const applyOptions: ApplyThemeOptions = { ...options, matchMedia };

	const apply = (theme: ThemeName, persist: boolean) => {
		current = theme;
		return applyTheme(theme, { ...applyOptions, persist });
	};
	const handleSystemChange = () => {
		if (current === 'system') apply(current, false);
	};

	const controller: ThemeController = {
		get current() {
			return current;
		},
		set(theme) {
			return apply(theme, true);
		},
		restore() {
			const saved = readTheme(options);
			apply(saved ?? current, false);
			return current;
		},
		start() {
			if (!started) {
				started = true;
				controller.restore();
				try {
					mediaQuery = matchMedia?.('(prefers-color-scheme: dark)') ?? null;
					mediaQuery?.addEventListener('change', handleSystemChange);
				} catch {
					mediaQuery = null;
				}
			}
			return controller.stop;
		},
		stop() {
			if (!started) return;
			mediaQuery?.removeEventListener('change', handleSystemChange);
			mediaQuery = null;
			started = false;
		},
	};

	return controller;
}
