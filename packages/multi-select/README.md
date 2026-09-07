# @wornpage/multi-select

> Part of **[Wornpage Components](https://github.com/wornpage/wornpage#component-library)**.
> [Browse the catalog](https://wornpage-components.pages.dev) · [Setup guide](https://github.com/wornpage/wornpage/blob/main/docs/getting-started.md) · [Wornpage overview](https://github.com/wornpage/wornpage)

Svelte 5 native multi-select with shared styling, compact sizing, and touch-safe defaults.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/wornpage/blob/main/packages/cli/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Source use

This package is not published to npm. Check out this repository at a reviewed commit, install its
dependencies from `bun.lock`, and consume `src/index.ts` through a local workspace alias. The
`@wornpage/multi-select` imports below assume that local alias; they do not resolve from the public
npm registry.

## Usage

```svelte
<script>
  import { MultiSelect } from '@wornpage/multi-select';

  const options = [
    { value: 'low', label: 'Low' },
    { value: 'high', label: 'High' },
    { value: 'paused', label: 'Paused', disabled: true }
  ];
</script>

<MultiSelect {options} bind:value={priorities} />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | `[]` | Bindable selected values |
| `onchange` | `(event: Event) => void` | - | Commit handler |
| `options` | `{ value: string; label: string; disabled?: boolean }[]` | - | Available option rows |
| `disabled` | `boolean` | `false` | Disables the control |
| `size` | `number` | - | Visible row count |

Give the control an accessible name with an associated `label`, `aria-label`, or `aria-labelledby`. Native listbox selection and keyboard behavior are preserved; `size` controls the visible row count above the component's 44px minimum target.

Keyboard focus resolves through the public `--worn-multi-select-focus` token, then the shared `--worn-focus` and `--worn-text` tokens, before falling back to the current text color. The accent-colored border and shadow remain supplemental state cues rather than the focus outline's contrast owner.
