# Svelte 5 component setup

Start with an existing Svelte 5 browser app. If you need one, use the
[official Svelte getting-started guide](https://svelte.dev/docs/svelte/getting-started).
The Svelte entries below are resolved by your browser bundler; their
browser-default entries are not SSR-safe.

Install the reviewed standalone archives with Bun (see
[Bun's `add` reference](https://bun.sh/docs/pm/cli/add)):

```bash
bun add "https://codeload.github.com/wornpage/button/tar.gz/6da25ba40af71d3329abc2a4631d46047abd180b"
bun add "https://codeload.github.com/wornpage/theme/tar.gz/f9ef5f1b5cccc90ac43695bd23ed735776b593d5"
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

## How a reviewed pin reaches consumers

Standalone repositories are staged and reviewed at a full SHA. That SHA is
then regenerated into this catalog mirror. A consumer deliberately promotes
the reviewed archive to its own dependency pin and existing package-manager
lockfile. This is not npm scope publishing, and Bun does not replace a
consumer production app's existing lockfile.

For component API details, use the current canonical
[Button source](https://github.com/wornpage/button/tree/6da25ba40af71d3329abc2a4631d46047abd180b) and
[Theme source](https://github.com/wornpage/theme/tree/f9ef5f1b5cccc90ac43695bd23ed735776b593d5).
