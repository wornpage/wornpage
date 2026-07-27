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
`prefers-color-scheme` setting as it changes.

## Usage (web component)

```html
<worn-theme id="t"></worn-theme>
<script type="module">
  import '@wornpage/theme';
  document.getElementById('t').theme = 'forest';
</script>
```

## Usage (no component)

The theme functions work on their own if you already have your own picker UI:

```js
import { applyTheme, resolveTheme, THEMES, THEME_LABELS } from '@wornpage/theme';

applyTheme('ocean');        // sets data-theme on <html>
resolveTheme('system');     // -> 'light' | 'dark', per OS preference
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

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `Theme` | component | Svelte theme picker |
| `ThemeElement` | component | Custom-element wrapper |
| `applyTheme(theme)` | `(ThemeName) => void` | Applies the theme to `<html>` |
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
