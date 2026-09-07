# Svelte 5 component setup

Start with an existing browser app using Svelte 5.56.8 or a later compatible
Svelte 5 release, as required by the Theme package. If you need one, use the
[official Svelte getting-started guide](https://svelte.dev/docs/svelte/getting-started).
The Svelte entries below are resolved by your browser bundler; their
browser-default entries are not SSR-safe.

Install the immutable component release archives with Bun (see
[Bun's `add` reference](https://bun.sh/docs/pm/cli/add)):

```bash
bun add "https://github.com/wornpage/wornpage/releases/download/components-2026.09.07.2/wornpage-button-0.2.2.tgz"
bun add "https://github.com/wornpage/wornpage/releases/download/components-2026.09.07.2/wornpage-theme-0.1.3.tgz"
```

Put this complete example in a `.svelte` file. It uses native buttons and
labels, visible keyboard focus, readable light/dark contrast, and touch-safe
controls on coarse pointers. Respect reduced-motion preferences in any motion
you add. Check the result on your actual target devices; this example is not a
universal accessibility certification.

```svelte
<script lang="ts">
  import { Button } from '@wornpage/button';
  import { Theme, type ThemeName } from '@wornpage/theme';

  const themes: ThemeName[] = ['system', 'light', 'dark'];
  let theme = $state<ThemeName>('system');
  let outcome = $state('Ready to try the example.');

  function completeExample() {
    outcome = 'Example complete.';
  }

  function reset() {
    outcome = 'Ready to try the example.';
  }
</script>

<section class="setup" aria-labelledby="setup-heading">
  <h1 id="setup-heading">Account setup</h1>
  <Theme bind:theme {themes} />
  <p aria-live="polite">{outcome}</p>
  <div class="actions">
    <Button variant="primary" onclick={completeExample}>Try action</Button>
    <Button onclick={reset}>Reset</Button>
  </div>
</section>

<style>
  .setup {
    --worn-bg-secondary: #eef2f0;
    --worn-surface: #ffffff;
    --worn-text: #18231e;
    --worn-text-muted: #4c6257;
    --worn-border: #9eafa5;
    --worn-radius: 0.5rem;
    --worn-accent: #087f5b;
    --worn-accent-text: #ffffff;
    --worn-focus: #005fcc;
    --worn-hover-bg: #deeee7;
    --worn-button-focus: var(--worn-focus);
    --wrn-theme-active-bg: var(--worn-accent);
    --wrn-theme-active-text: var(--worn-accent-text);
    --wrn-theme-border: var(--worn-border);
    --wrn-theme-btn-bg: var(--worn-surface);
    --wrn-theme-hover: var(--worn-hover-bg);
    --wrn-theme-text: var(--worn-text);
    --wrn-theme-focus: var(--worn-focus);
    background: var(--worn-surface);
    color: var(--worn-text);
    max-width: 34rem;
    padding: 1rem;
  }

  :global(html[data-theme='dark']) .setup {
    --worn-bg-secondary: #24352d;
    --worn-surface: #17231e;
    --worn-text: #f2f8f4;
    --worn-text-muted: #bdd1c5;
    --worn-border: #789184;
    --worn-accent: #40c98f;
    --worn-accent-text: #092217;
    --worn-focus: #8dc8ff;
    --worn-hover-bg: #2c473a;
  }

  .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .setup :global(button:focus-visible) { outline: 2px solid var(--worn-focus); outline-offset: 2px; }
</style>
```

`Theme` is deliberately limited here to `system`, `light`, and `dark`; each
explicit choice changes the live palette, while System follows the operating
system and may resolve to the currently active palette. The host owns the
`--worn-*` Button tokens and maps the Theme-only `--wrn-theme-*` variables at
that boundary. The example action state resets on reload; only the Theme
preference persists.

## Acceptance checklist

- No parallax, scroll hijacking, or content gated behind animation.
- Native semantics and labels remain intact, with visible keyboard focus.
- Verify contrast, touch targets, and zoom at the sizes your users need.
- Honor reduced-motion preferences for any motion you introduce.

## How a release reaches consumers

Component source is reviewed in this repository. The root verification gate
tests the workspace, builds the browser bundles, packs each declared consumer
entry, and verifies the catalog. The repository owner prepares a draft through
the guarded release helper, then publishes those packages as immutable GitHub
assets. Keep the resulting
archive URL and SHA-512 lockfile entry together when upgrading a consumer.
This is not npm scope publication.

For component API details, use the current canonical
[Button source](https://github.com/wornpage/wornpage/tree/components-2026.09.07.2/packages/button) and
[Theme source](https://github.com/wornpage/wornpage/tree/components-2026.09.07.2/packages/theme).
