# @wornpage/multi-select

Svelte 5 native multi-select with shared styling, compact sizing, and touch-safe defaults.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```bash
npm install @wornpage/multi-select
```

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
