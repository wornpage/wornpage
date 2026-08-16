# @wornpage/button

Svelte 5 button primitives: text and link buttons plus accessible icon-only actions.

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
  import { Button, IconButton } from '@wornpage/button';
  import { X } from 'lucide-svelte';
</script>

<Button variant="primary" onclick={() => alert('hi')}>Click me</Button>
<Button variant="danger" href="/danger">Go danger</Button>
<Button size="sm" disabled>Small disabled</Button>
<Button class="toolbar-action">Refresh</Button>
<IconButton label="Dismiss notification"><X aria-hidden="true" /></IconButton>
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
| `variant` | `'default' \| 'primary' \| 'danger' \| 'warning'` | `'default'` | Visual style; `IconButton` supports `default` and `danger` |
| `size` | `'sm' \| 'md'` | `'md'` | Button size; both sizes keep a 44px target for coarse pointers |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | — | Renders as `<a>` link |
| `class` | `string` | — | Additional classes merged with the component class |
| `onclick` | `(e) => void` | — | Click handler |
| `type` | `'button' \| 'submit'` | `'button'` | Button type |

`IconButton` requires `label`, uses it as the accessible name and default tooltip, and accepts any icon component as its child. Its default target is 44px; `size="sm"` is 36px on fine pointers and remains 44px on coarse pointers. The browser bundle still registers only `<worn-button>` because Svelte icon children are a source-component capability.

## CSS API

The component uses CSS custom properties from the parent theme:
- `--cockpit-text`, `--cockpit-surface`, `--cockpit-border`, `--cockpit-radius`
- `--cockpit-accent`, `--cockpit-accent-text`
- `--cockpit-danger-bg`, `--cockpit-danger-border`, `--cockpit-danger-text`
- `--cockpit-warning-text`, `--cockpit-warning-bg`
- `--font-typewriter`
- `--worn-button-focus` (optional focus-ring override; defaults to `--cockpit-text`)

Additional classes, including `is-active`, are merged with the component class. Link buttons keep button presentation without inherited underlines, and long labels wrap within their container.
