# @wornpage/date-input

Svelte 5 date input with shared app-shell styling and native date-picker semantics. It keeps a compact desktop field and uses a 44px minimum target on coarse pointers.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```bash
npm install @wornpage/date-input
```

## Usage

```svelte
<script>
  import { DateInput } from '@wornpage/date-input';
</script>

<DateInput bind:value={due} />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `""` | Bindable `YYYY-MM-DD` date value |
| `oninput` | `(event: Event) => void` | - | Live input handler |
| `onchange` | `(event: Event) => void` | - | Commit handler |
| `required` | `boolean` | `false` | Native required state |
| `disabled` | `boolean` | `false` | Disables the control |
| `min` | `string` | - | Minimum selectable date |
| `max` | `string` | - | Maximum selectable date |
| `step` | `string` | - | Native date step |

## Interaction

The component preserves the browser-native date picker. On touch-first devices it uses a 16px input font to avoid iOS zoom and a minimum 44px control height; desktop remains compact.
