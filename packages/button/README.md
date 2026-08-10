# @wornpage/button

Svelte 5 button component — primary, danger, warning variants, link mode (`href`), size `sm`/`md`, keyboard-friendly `focus-visible` outline.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```bash
npm install @wornpage/button
```

## Usage

```svelte
<script>
  import { Button } from '@wornpage/button';
</script>

<Button variant="primary" onclick={() => alert('hi')}>Click me</Button>
<Button variant="danger" href="/danger">Go danger</Button>
<Button size="sm" disabled>Small disabled</Button>
```

## Browser bundle

The generated browser bundle registers `<worn-button>`. Its `label`, `variant`, `size`, `type`, `href`, and `disabled` attributes map to the Svelte component props.

```html
<script type="module" src="./dist/worn-button.js"></script>
<worn-button label="Continue" variant="primary"></worn-button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'danger' \| 'warning'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | — | Renders as `<a>` link |
| `onclick` | `(e) => void` | — | Click handler |
| `type` | `'button' \| 'submit'` | `'button'` | Button type |

## CSS API

The component uses CSS custom properties from the parent theme:
- `--cockpit-text`, `--cockpit-surface`, `--cockpit-border`, `--cockpit-radius`
- `--cockpit-accent`, `--cockpit-accent-text`
- `--cockpit-danger-bg`, `--cockpit-danger-border`, `--cockpit-danger-text`
- `--cockpit-warning-text`, `--cockpit-warning-bg`
- `--font-typewriter`

An `is-active` class can be passed via Svelte `class:` directive for toggle state.
