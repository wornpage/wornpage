# Catalog Contract

The public catalog is a local, inspectable playground for every component in
`components-release.json`. It does not call an application backend,
emit telemetry, or represent local example state as a persisted save.

## Ownership

| Concern | Owner | Contract |
| --- | --- | --- |
| Theme preference and System resolution | `@wornpage/theme` `Theme` | Persists only valid choices in `wrn-theme`; System follows the operating-system color scheme. |
| Host palette | `demo/index.html` | Defines the complete semantic `--worn-*` palette for all eight named themes. Shell and component examples consume the same tokens. |
| Component-specific theme controls | `demo/src/App.svelte` | Maps Theme's live `--wrn-theme-*` consumer variables to semantic host tokens. |
| Published source metadata | `components-release.json` through `scripts/components.ts` and `demo/src/sections.ts` | Canonical source path, named immutable release, package archive, and sample import share one release manifest. |
| Example state | `demo/src/ComponentExample.svelte` | Local models expose outcomes, reset paths, and applicable disabled, loading, empty, error, undo, and redo states. |
| Rendered verification | `scripts/catalog-browser-check.mjs` | Tests the built output and writes ignored evidence under `output/playwright/catalog/`. |
| Verification orchestration | `scripts/verify-catalog.mjs` | Runs workspace, delivery, Theme consumer types, Bun tests, component packaging, catalog build, and browser stages exactly once in that order; preserves per-stage logs and failure status under `output/verify-catalog/`. |

`--worn-muted` and `--worn-subtle` are retained semantic spellings because the
live `@wornpage/undo` consumer reads them. Their values are owned by the host
palette, map to `--worn-text-muted` and `--worn-bg-secondary`, and are covered
by the catalog browser matrix. Remove them when the reviewed Undo source no
longer consumes either spelling.

The `--wrn-theme-*` variables are component-specific public overrides rather
than a second global palette. They are mapped only at the Theme host boundary;
Theme is the named live consumer, the catalog owns the mapping, and the matrix
checks the control in every palette. Remove the mapping only if a reviewed
Theme revision adopts semantic `--worn-*` fallbacks directly.

Compatibility retained:
- Consumer: Catalog host navigation immediately after `@wornpage/cmdk` closes.
- Owner: `demo/src/App.svelte` `openPalette` / `handlePaletteClose` focus phase.
- Removal condition: A reviewed Cmdk revision invokes `onclose` only after its opener-focus restoration has settled.
- Test coverage: The built-browser gate runs 20 cancellation-to-navigation checks with normal motion and 20 with reduced motion, including navigation triggered by native opener restoration.
- Why hard cutover is unsafe now: Cmdk currently restores opener focus after calling `onclose`; removing this host phase would race that restoration and lose the requested navigation focus. The source consolidation preserves this existing interaction contract.

## Catalog layout

`demo/src/App.svelte` owns the root catalog layout. Its desktop shell is centered
at a maximum of 1180px, with 48px outer margins at narrower widths, a 248px
sidebar, a 48px column gap, and a main column capped at 840px. The sidebar starts
24px below the viewport when sticky and fits within the viewport height.

| Viewport width | Sidebar | Column gap | Shell width |
| --- | --- | --- | --- |
| Above 1100px | 248px | 48px | Smaller of 1180px and viewport minus 96px |
| 951–1100px | 224px | 32px | Viewport minus 96px |
| 721–950px | 224px | 24px | Viewport minus 56px |
| 720px and below | 72px collapsed rail; expanded navigation overlays the content | 0 | Full viewport |

Header and section descriptions are limited to 65ch with a 1.65 line height.
Catalog h1 and h2 headings use the system sans-serif stack. Component and body
fonts remain owned by their existing styles. Desktop sections have 32px top and
36px bottom padding, 24px below their headings, and 24px before metadata.
Compact sections use 24px/28px padding and an 18px heading gap. Safe-area padding,
44px navigation targets, contained content, and visible keyboard focus remain
part of the mobile contract.

## Verification denominators

The named-theme matrix is exactly 16 cells: compact `320x900` with touch and
desktop `1440x1000` with a fine pointer, each across light, dark, forest,
ocean, sepia, halloween, winter, and holiday. Every cell verifies all 26
sections, metadata, non-empty semantic tokens, readable shell/accent contrast,
containment, a real local state transition, persistence, and browser/network
cleanliness.

The workspace/build contracts run on Bun 1.3.14. Playwright 1.62.0 and its
directly owned Vite preview child run on Node 24.18.0; both runtimes are pinned
in CI, which installs Chromium before the gate. The harness requires its own
preview startup receipt, so an occupied port cannot redirect verification to
another server.

System light and System dark are two additional cases and are reported
separately. Keyboard/modal/navigation and reduced-motion behavior are separate
scenarios; they do not inflate the 16-cell denominator.

Chromium emulation is not proof of current iOS Safari or installed iOS PWA
behavior. The browser gate covers compact touch emulation, editable 16px text,
44px targets, focus, containment, overlays, and safe-area-aware CSS. Current
iOS Safari and standalone-PWA device runs remain a release-owner device check.

## Failure evidence

Run the complete contract with the stable public command:

```bash
bun run verify:catalog
```

Each invocation creates a new `output/verify-catalog/runs/<run-id>/` directory.
`summary.json` records the current or failed phase, timestamps, duration, exit
code, signal, and whether later stages were skipped. Every stage owns separate
stdout and stderr logs. `output/verify-catalog/latest.json` mirrors the newest
summary for quick discovery without replacing any prior run directory. Output
continues streaming to the terminal, so local and CI logs remain useful too.

The runner never retries a failed stage. A nonzero stage remains the overall
nonzero result and prevents every later stage from running. CI uploads the
ignored verification directory even on failure.

For a bounded regression while working specifically on palette-cancellation
focus ordering, run:

```bash
bun run test:catalog:browser -- --focus-ordering
```

This runs 20 normal-motion and 20 reduced-motion cancellation-to-navigation
checks. It is a diagnostic subset, not a substitute for `bun run verify:catalog`.
The full gate clears only its dedicated `output/playwright/catalog/` directory
before capturing fresh screenshots and `report.json`. The bounded focus-ordering
diagnostic preserves those full-run artifacts; durable staged logs under
`output/verify-catalog/` are owned separately and are never cleared by the
browser harness.
