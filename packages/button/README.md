# @wornpage/button

Svelte 5 button component — primary, danger, warning variants, link mode (`href`), size `sm`/`md`, keyboard-friendly `focus-visible` outline.

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
