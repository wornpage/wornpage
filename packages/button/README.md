# @wornpage/button

Svelte 5 button primitives: text and link buttons plus accessible icon-only actions.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Source use

This package is not published to npm. Check out this repository at a reviewed commit, install its
dependencies from `bun.lock`, and consume `src/index.ts` through a local workspace alias. The
`@wornpage/button` imports below assume that local alias; they do not resolve from the public npm
registry.

## Usage

```svelte
<script>
  import { Button, IconButton, ReactionButton } from '@wornpage/button';
  import { X } from 'lucide-svelte';
</script>

<Button variant="primary" onclick={() => alert('hi')}>Click me</Button>
<Button variant="danger" href="/danger">Go danger</Button>
<Button size="sm" disabled>Small disabled</Button>
<Button class="toolbar-action">Refresh</Button>
<IconButton label="Dismiss notification"><X aria-hidden="true" /></IconButton>
<IconButton label="Open navigation" size="lg"><Menu aria-hidden="true" /></IconButton>
<ReactionButton reaction="Like" label="React with like" count={4} pressed onclick={toggleLike} />
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
| `size` | `'sm' \| 'md'` (`Button`), `'sm' \| 'md' \| 'lg'` (`IconButton`) | `'md'` | `IconButton` uses 36px, 44px, or 48px targets; small targets recover to 44px on coarse pointers |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | — | Renders as `<a>` after strict destination validation |
| `class` | `string` | — | Additional classes merged with the component class |
| `onclick` | `(e) => void` | — | Click handler |
| `type` | `'button' \| 'submit'` | `'button'` | Button type |

### ReactionButton

`ReactionButton` is a controlled pressed-state action for emoji, symbols, or
short reaction text. The host owns the reaction data and mutation; the
component owns button semantics, count presentation, focus, and a stable 44px
target.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reaction` | `string` | required | Visible reaction mark or short text |
| `label` | `string` | `"React {reaction}"` | Accessible action label; a positive count is appended |
| `count` | `number` | `0` | Positive counts are rendered beside the reaction |
| `pressed` | `boolean` | `false` | Controlled selected state exposed through `aria-pressed` |
| `disabled` | `boolean` | `false` | Disables the native button without dimming its content |
| `onclick` | `(event) => void` | — | Host mutation callback |

`IconButton` requires `label`, uses it as the accessible name and default tooltip, and accepts any icon component as its child. Its default target is 44px; `size="sm"` is 36px on fine pointers and remains 44px on coarse pointers, while `size="lg"` provides a 48px floating-control target. The browser bundle still registers only `<worn-button>` because Svelte icon children are a source-component capability.

## CSS API

The component uses CSS custom properties from the parent theme:
- `--worn-text`, `--worn-surface`, `--worn-border`, `--worn-radius`
- `--worn-accent`, `--worn-accent-text`
- `--worn-danger-bg`, `--worn-danger-border`, `--worn-danger-text`
- `--worn-warning-text`, `--worn-warning-bg`
- `--font-typewriter`
- `--worn-button-focus` (optional focus-ring override; defaults to `--worn-focus`, then `--worn-text`)

Additional classes, including `is-active`, are merged with the component class. Link buttons keep button presentation without inherited underlines, and long labels wrap within their container.

Link destinations may be relative or use `https:`, `mailto:`, or `tel:`. Empty values, network-path
references, backslashes, separator/control/format characters, plain HTTP, and every other scheme
are rejected with a `TypeError`; omit `href` to render a button.
