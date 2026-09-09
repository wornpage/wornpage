# Wornpage

**Accessible interfaces and human-controlled AI workflows.**

Wornpage is the technical publisher and namespace for work that keeps AI-assisted
delivery visible, bounded, and subject to human approval.

## Start here

| Part of Wornpage | What it is for | Explore |
| --- | --- | --- |
| **Projects — application work and public challenge** | Projects application work is distinct from the frozen public WebMCP Challenge demo. The read-only challenge lets browser agents inspect visible evidence and prepare drafts for human review. | [Open the WebMCP challenge demo](https://projects-webmcp-extension.pages.dev/webmcp-challenge) · [Challenge source](https://github.com/wornpage/projects-webmcp-extension) |
| **Components — Svelte component library** | Build Svelte 5 interfaces with shared interaction patterns, keyboard support, themes, and verified package delivery. | [Browse the catalog](https://wornpage-components.pages.dev) · [Setup guide](docs/getting-started.md) |
| **WebMCP Conformance — the validation toolkit** | Check page-owned tool declarations, authority limits, lifecycle behavior, and action receipts. | [Source and checks](https://github.com/wornpage/webmcp-conformance) |
| **PR Machine — the delivery tool** | Turn reviewed agent work into a verified draft pull request. The repository owner controls merging. Public beta. | [Install and use](https://github.com/wornpage/projects-pr-machine#install) · [Workflow evidence](https://github.com/wornpage/projects-pr-machine/blob/main/docs/challenge-extension-case-study.md) |

These are the four public entry points. Read the short [portfolio case study](docs/portfolio.md) for the demonstrated controls and their limits. All component source now lives here under **`packages/`**; see the [repository map](docs/repository-map.md) for source ownership and contribution paths.

## Svelte component library

This repository is the Wornpage overview and the integration catalog for 26
component and supporting packages, three development tools, and a CLI. This repository owns package source, the catalog, and immutable component releases.

Start with the compact, copyable [Svelte 5 component setup guide](docs/getting-started.md).

<details>
<summary><strong>Installation, component catalog, architecture, and contributing</strong></summary>

> One component library: 26 component and supporting packages, three development
> tools, and one internal CLI. Install versioned package archives from this repository's immutable GitHub releases. The `@wornpage` npm scope is not a supported distribution path.

Live catalog: <https://wornpage-components.pages.dev>

Release example: [Wornpage Projects — WebMCP Challenge](https://projects-webmcp-extension.pages.dev/webmcp-challenge)

## Quick start — browsing

```bash
git clone https://github.com/wornpage/wornpage.git
cd wornpage
bun install
bunx playwright install chromium # one-time local browser install; Node 24.18.0 required
bun run verify:catalog # full contracts, build, and Chromium catalog matrix
```

`verify:catalog` runs eight checks once in order, including Theme consumer types
and Toast keyboard focus in Chromium.
It preserves per-stage stdout, stderr, exit status, phase, and timing under
`output/verify-catalog/runs/`. The directory is ignored locally and uploaded by
CI even when a stage fails.

## Use in your app

Follow the canonical [Svelte 5 component setup guide](docs/getting-started.md)
for Button and Theme release archives and a complete example.

## What's inside

### Components and supporting packages (`packages/` — canonical source)

| Package | Source | Delivery | Description |
|---|---|---|---|
| `@wornpage/alert` | [packages/alert](packages/alert) | `browser-bundle` | Inline alerts with live-region semantics and contextual dismissal |
| `@wornpage/async-states` | [packages/async-states](packages/async-states) | `source` | Loading, empty, error, spinner, and skeleton states |
| `@wornpage/binary-controls` | [packages/binary-controls](packages/binary-controls) | `browser-bundle` | Native checkbox and switch controls with touch-safe targets |
| `@wornpage/button` | [packages/button](packages/button) | `browser-bundle` | Buttons and button links with shared variants and disabled states |
| `@wornpage/cmdk` | [packages/cmdk](packages/cmdk) | `browser-bundle` | Keyboard-first command palette with fuzzy search |
| `@wornpage/command-surfaces` | [packages/command-surfaces](packages/command-surfaces) | `source` | Compact command toolbars and keyboard hints |
| `@wornpage/data-display` | [packages/data-display](packages/data-display) | `source` | Badges, chips, avatars, progress, and timelines |
| `@wornpage/date-input` | [packages/date-input](packages/date-input) | `source` | Native date input with touch-safe styling |
| `@wornpage/dialog` | [packages/dialog](packages/dialog) | `browser-bundle` | Modal dialog with focus trapping and reduced motion |
| `@wornpage/disclosure` | [packages/disclosure](packages/disclosure) | `browser-bundle` | Native accordion and collapsible disclosures |
| `@wornpage/drawer` | [packages/drawer](packages/drawer) | `browser-bundle` | Edge drawer with modal isolation and focus management |
| `@wornpage/form-fields` | [packages/form-fields](packages/form-fields) | `browser-bundle` | Input, textarea, select, and range controls |
| `@wornpage/layout-surfaces` | [packages/layout-surfaces](packages/layout-surfaces) | `source` | Panels, containers, cards, dividers, and resizable panes |
| `@wornpage/multi-select` | [packages/multi-select](packages/multi-select) | `source` | Compact multi-select control with touch-safe defaults |
| `@wornpage/navigation-surfaces` | [packages/navigation-surfaces](packages/navigation-surfaces) | `source` | Breadcrumb and pagination navigation |
| `@wornpage/receipt` | [packages/receipt](packages/receipt) | `source` | Undo-capable action receipt cards |
| `@wornpage/scenarios` | [packages/scenarios](packages/scenarios) | `source` | Shared scenario definitions and validators |
| `@wornpage/segmented-control` | [packages/segmented-control](packages/segmented-control) | `browser-bundle` | Segmented native radio groups |
| `@wornpage/select-card` | [packages/select-card](packages/select-card) | `browser-bundle` | Card-based selection with pressed and disabled states |
| `@wornpage/sidebar` | [packages/sidebar](packages/sidebar) | `browser-bundle` | Collapsible navigation with search and keyboard support |
| `@wornpage/sync` | [packages/sync](packages/sync) | `source` | Sync-code generation, hashing, and QR encoding |
| `@wornpage/tabs` | [packages/tabs](packages/tabs) | `browser-bundle` | Roving tabs with stable panels and compact overflow |
| `@wornpage/theme` | [packages/theme](packages/theme) | `browser-bundle` | Persistent multi-theme CSS custom properties |
| `@wornpage/toast` | [packages/toast](packages/toast) | `browser-bundle` | Toast notifications with contextual dismissal |
| `@wornpage/undo` | [packages/undo](packages/undo) | `browser-bundle` | Receipt-oriented undo and redo stack |
| `@wornpage/workflow` | [packages/workflow](packages/workflow) | `source` | Pack state machine for blocker and next-action flow |
| `@wornpage/cli` | [packages/cli](packages/cli) | `tooling` | Workspace scaffolding and release verification |

### Tools (`tools/` — monorepo-native)

| Tool | Description |
|---|---|
| `apca-lc` | APCA perceptual contrast calculator (MIT license, zero deps) |
| `public-audit` | Static asset deploy-safety linter |
| `find-unused-css` | Scanner that maps CSS selectors to source files |

## Architecture

- **This repository is canonical.** Edit component implementations in `packages/<name>/src/`.
- **One workspace and lockfile.** The catalog consumes `workspace:*` dependencies; `bun.lock` fixes the build environment.
- **One release path.** `components-release.json` gives every package an explicit version and immutable release tag. `bun run pack:components` builds and packs all declared consumer entries for regression coverage; draft publication uploads only packages changed from the published baseline manifest.
- **Generated bundles stay generated.** Package `dist/` directories are ignored build output, never a second implementation.
- **Immutable public delivery.** GitHub release assets contain changed package archives plus a full-catalog manifest. Catalog and peer-install links retain each package's actual immutable release instead of moving every package to the newest tag.
- **Historical sources remain available where required.** See [the migration record](docs/component-migration.md) for protected consumers and retained archive addresses.
- **The catalog is a working playground.** Its interaction and browser contracts are in [docs/catalog-contract.md](docs/catalog-contract.md).

## Contributing

1. Change the owning package here and add the relevant behavior test.
2. Run `bun run verify:catalog` from the repository root.
3. Submit a PR to this repository.
4. Follow [component delivery](packages/cli/docs/component-delivery.md) to publish the next immutable release.

## License

This catalog is MIT-licensed. Each linked project documents its own license;
PR Machine is AGPL-3.0-only.

</details>
