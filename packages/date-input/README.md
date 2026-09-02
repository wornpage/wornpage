# @wornpage/date-input

Svelte 5 date input with shared app-shell styling and native date-picker semantics. It keeps a compact desktop field and uses a 44px minimum target on coarse pointers.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Source use

This package is not published to npm. Check out this repository at a reviewed commit, install its
dependencies from `bun.lock`, and consume `src/index.ts` through a local workspace alias. The
`@wornpage/date-input` imports below assume that local alias; they do not resolve from the public
npm registry.

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

## Styling

`--worn-date-input-focus` customizes the keyboard focus outline. Its default falls through the shared `--worn-focus` and `--worn-text` tokens so the outline remains distinguishable from themed field surfaces. Border and shadow feedback continue to use the shared accent tokens.
