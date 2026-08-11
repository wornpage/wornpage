# @wornpage/multi-select

Svelte 5 native multi-select control with shared styling and compact layout support.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and Svelte consumer entry for this package.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, and package metadata on every relevant release.
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
  ];
</script>

<MultiSelect {options} bind:value={priorities} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string[] | `[]` | Bindable selected values |
| `onchange` | `(e: Event) => void` | — | Commit handler |
| `options` | `{ value: string, label: string }[]` | — | Available option rows |
| `disabled` | boolean | `false` | Disables the control |
| `size` | number | `undefined` | Visible row count |
| `class` | string | `""` | Additional root class |
