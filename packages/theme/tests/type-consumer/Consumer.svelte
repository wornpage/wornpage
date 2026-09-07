<script lang="ts">
	import {
		Theme,
		createThemeController,
		resolveTheme,
		THEMES,
		THEME_LABELS,
		type EffectiveTheme,
		type ThemeName,
	} from '@wornpage/theme';

	const controller = createThemeController({
		initialTheme: 'system',
		root: null,
		storage: null,
		matchMedia: null,
	});
	let theme = $state<ThemeName>(controller.current);
	let effectiveTheme = $state<EffectiveTheme>(resolveTheme(controller.current, null));
</script>

<Theme
	bind:theme
	themes={THEMES}
	storageKey="consumer-theme"
	onchange={(selected, effective) => {
		theme = selected;
		effectiveTheme = effective;
	}}
/>
<p>{THEME_LABELS[theme]}: {effectiveTheme}</p>
