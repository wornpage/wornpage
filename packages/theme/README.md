# @wornpage/theme

Svelte 5 theme **switcher** — sets `data-theme` on `<html>`, persists the
choice, and follows the OS while set to `system`. Zero dependencies.

Nine theme names: `system`, `light`, `dark`, `forest`, `ocean`, `sepia`,
`halloween`, `winter`, `holiday`.

> **This package ships no CSS.** It is the switching and persistence half of a
> theme system; you supply the `[data-theme="…"]` rules that say what each
> theme looks like. Drop it into an app with no theme CSS and the buttons will
> work, `data-theme` will change, and nothing on screen will move. See
> [Supplying the CSS](#supplying-the-css) below — it is three lines to get
> going.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```bash
bun add @wornpage/theme
```

## Usage (Svelte)

```svelte
<script>
  import { Theme } from '@wornpage/theme';
  let theme = $state('system');
</script>

<Theme bind:theme />
```

The component restores the saved theme on mount, writes every change to
`localStorage` under `wrn-theme`, and — while set to `system` — follows the OS
`prefers-color-scheme` setting as it changes. Set `storageKey` when a product
needs a versioned or app-specific preference key.

## Usage (web component)

```html
<worn-theme id="t"></worn-theme>
<script type="module">
  import '@wornpage/theme';
  document.getElementById('t').theme = 'forest';
</script>
```

The browser entry is generated from `src/ThemeElement.svelte` with
`bun run build`; do not edit `dist/worn-theme.js` directly.

## Usage (no component)

The theme functions work on their own if you already have your own picker UI:

```js
import { createThemeController, THEMES, THEME_LABELS } from '@wornpage/theme';

const themes = createThemeController({ storageKey: 'my-product-theme' });
themes.start();             // restore once and follow OS preference changes
themes.set('ocean');        // set data-theme and persist the logical choice
THEMES;                     // readonly list of theme names
THEME_LABELS;               // display names, keyed by theme name
```

## Supplying the CSS

`applyTheme` only sets `data-theme` on `<html>`. Define your palette per theme
and let everything else read the custom properties:

```css
:root,
[data-theme="light"] { --bg: #fdfbf7; --text: #21322b; }
[data-theme="dark"]   { --bg: #14201b; --text: #e8f0ec; }
[data-theme="forest"] { --bg: #10201a; --text: #d8eadf; }
[data-theme="ocean"]  { --bg: #0f1d29; --text: #dceaf5; }

body { background: var(--bg); color: var(--text); }
```

`resolveTheme` collapses `system` to `light` or `dark` before the attribute is
written, so you never need a `[data-theme="system"]` rule.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `ThemeName` | `'system'` | Bindable. One of `THEMES`. |
| `storageKey` | `string` | `'wrn-theme'` | Persistence key. |
| `themes` | `readonly ThemeName[]` | `THEMES` | Ordered subset rendered by the Svelte picker. |

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `Theme` | component | Svelte theme picker |
| `ThemeElement` | component | Custom-element wrapper |
| `createThemeController(options)` | `(ThemeControllerOptions) => ThemeController` | Restores, applies, persists, and tracks system changes |
| `applyTheme(theme, options)` | `(ThemeName, ApplyThemeOptions) => EffectiveTheme` | Applies and optionally persists a theme |
| `readTheme(options)` | `(ThemeRuntimeOptions) => ThemeName \| null` | Reads and validates the stored logical choice |
| `isThemeName(value, themes)` | type guard | Validates a value against the active theme list |
| `resolveTheme(theme)` | `(ThemeName) => string` | Resolves `system` to `light`/`dark` |
| `THEMES` | `readonly ThemeName[]` | Every available theme name |
| `THEME_LABELS` | `Record<string, string>` | Human-readable labels |

## Note on non-browser imports

The built bundle registers a custom element, so importing it outside a browser
(a bun or node server process) will fail. Bundle it for the browser, or import
`applyTheme` / `resolveTheme` from source via the `svelte` export condition if
you only need the pure functions.

## Tests

```bash
bun test
```

## License

MIT
