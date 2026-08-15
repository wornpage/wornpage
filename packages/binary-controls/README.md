# @wornpage/binary-controls

Svelte 5 checkbox and switch controls with native input semantics, full-surface touch targets, compact label containment, and state boundaries that remain legible across Wornpage themes.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```sh
bun add github:wornpage/binary-controls
```

## Svelte

```svelte
<script lang="ts">
  import { Checkbox, Switch } from '@wornpage/binary-controls';

  let archived = $state(false);
  let updates = $state(true);
</script>

<Checkbox bind:checked={archived} label="Include archived" />
<Switch bind:checked={updates} label="Email updates" />
```

For an icon-only control, omit `label` and supply an accessible name:

```svelte
<Checkbox aria-label="Complete subtask" />
```

## Browser bundle

```html
<script type="module" src="./dist/worn-binary-controls.js"></script>
<worn-checkbox checked label="Include archived"></worn-checkbox>
<worn-switch label="Email updates"></worn-switch>
```

Both custom elements emit a bubbling `change` event whose `detail` is `{ checked: boolean }`.
The standard `aria-label` attribute is forwarded to the native input when no visible `label` is supplied.

## API

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | boolean | `false` | Bindable native checked state. |
| `onchange` | `(event: Event) => void` | - | Receives the native input change event. |
| `label` | string | - | Visible label owned by the native input. |
| `disabled` | boolean | `false` | Disables the native input without hiding its label. |
| remaining attributes | input attributes | - | Forwarded to the native input, including `aria-label` and `data-*`. |

The package expects the Wornpage `--cockpit-*` color and typography tokens. Override `--worn-binary-boundary` on a control only when a host theme has independently verified a 3:1 state boundary.

## Verification

```sh
bun test
bun run build
bun pm pack --dry-run
```
