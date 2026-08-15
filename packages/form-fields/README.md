# @wornpage/form-fields

Native Svelte 5 input, textarea, select, and range controls for the Wornpage design system.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Svelte

```svelte
<script>
  import { Input, Textarea, Select, Range } from '@wornpage/form-fields';

  let title = $state('');
  let context = $state('');
  let owner = $state('priya');
  let progress = $state(50);
</script>

<label for="project-title">Project</label>
<Input id="project-title" bind:value={title} autocomplete="organization" />

<label for="project-context">Context</label>
<Textarea id="project-context" bind:value={context} rows={3} />

<label for="project-owner">Owner</label>
<Select
  id="project-owner"
  bind:value={owner}
  options={[{ value: 'priya', label: 'Priya Shah' }]}
/>

<Range bind:value={progress} label="Progress" suffix="%" />
```

The components preserve native input, textarea, select, and range semantics. Remaining attributes are forwarded to the native control. `autocomplete` is omitted unless a consumer supplies it, so browsers and password managers are not suppressed by a component default.

Every field owns its minimum touch size, responsive containment, focus-visible treatment, disabled/read-only states, coarse-pointer sizing, and reduced-motion behavior. The select arrow derives from `currentColor` instead of a fixed palette value. Range values remain contained without collapsing the visible track, and its native input owns keyboard behavior.

## Browser bundle

```html
<script type="module" src="./dist/worn-form-fields.js"></script>

<worn-input aria-label="Project name"></worn-input>
<worn-textarea aria-label="Context" rows="3"></worn-textarea>
<worn-select
  aria-label="Owner"
  options='[{"value":"priya","label":"Priya Shah"}]'
></worn-select>
<worn-range aria-label="Progress" value="50" suffix="%"></worn-range>
```

The bundle registers `<worn-input>`, `<worn-textarea>`, `<worn-select>`, and `<worn-range>`. Set `aria-label` on each custom element because labels outside a shadow root cannot label the internal native control.

## Theme tokens

- `--cockpit-surface`
- `--cockpit-bg-secondary`
- `--cockpit-border`
- `--cockpit-border-strong`
- `--cockpit-text`
- `--cockpit-text-secondary`
- `--cockpit-text-muted`
- `--cockpit-accent`
- `--cockpit-accent-50`
- `--cockpit-radius-sm`
- `--font-typewriter`
