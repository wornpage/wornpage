# @wornpage/alert

Inline Svelte 5 alerts for the Wornpage design system.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

```svelte
<script>
  import { Alert } from '@wornpage/alert';
</script>

<Alert tone="danger" title="Deployment failed" dismissible ondismiss={clearError}>
  Check the build logs and retry.
</Alert>
```

Danger alerts use an assertive live region; info, success, and warning alerts use a polite status region. All tones own narrow containment, hostile-text wrapping, theme-safe icons, reduced-motion entry, and a 44 px dismiss target.

When `dismissible` is true, `dismissLabel` overrides the accessible button name. Otherwise a titled alert uses `Dismiss {title}` and an untitled alert uses `Dismiss alert`.

## Browser bundle

```html
<script type="module" src="./dist/worn-alert.js"></script>

<worn-alert tone="warning" title="Review needed" dismissible>
  Two checks remain.
</worn-alert>
```

The bundle registers `<worn-alert>`. Dismissal emits a bubbling, composed `dismiss` event.

## Props

- `tone?: 'info' | 'success' | 'warning' | 'danger'`
- `dismissible?: boolean`
- `title?: string`
- `dismissLabel?: string`
- `ondismiss?: () => void`

The default slot contains the alert message.

## Theme tokens

- `--cockpit-accent-50`
- `--cockpit-accent`
- `--cockpit-text`
- `--cockpit-success-bg`
- `--cockpit-success-border`
- `--cockpit-success-text`
- `--cockpit-warning-bg`
- `--cockpit-warning-border`
- `--cockpit-warning-text`
- `--cockpit-danger-bg`
- `--cockpit-danger-border`
- `--cockpit-danger-text`
- `--cockpit-radius`
- `--font-typewriter`
