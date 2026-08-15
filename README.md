# Wornpage

> Component library + dev toolkit. **The tools are framework-agnostic.**
> **This monorepo is a mirror.** Individual packages have their own repos.
> Import them directly: `bun add @wornpage/sidebar`

## Quick start — browsing

```bash
git clone https://github.com/wornpage/wornpage.git
cd wornpage
bun install
bun run check:workspace
bun run check:components
bun test          # 100+ tests across all packages and tools
```

## Quick start — using in your app

```bash
# Import from standalone repos (canonical source):
bun add @wornpage/sidebar    # or: github:wornpage/sidebar
bun add @wornpage/button
bun add @wornpage/cmdk
bun add @wornpage/toast
```

## What's inside

### Components (`packages/` — mirrored from standalone repos)

| Package | Standalone repo | Delivery | Description |
|---|---|---|---|
| `@wornpage/alert` | [wornpage/alert](https://github.com/wornpage/alert) | `browser-bundle` | Inline alerts with live-region semantics and contextual dismissal |
| `@wornpage/async-states` | [wornpage/async-states](https://github.com/wornpage/async-states) | `source` | Loading, empty, error, spinner, and skeleton states |
| `@wornpage/binary-controls` | [wornpage/binary-controls](https://github.com/wornpage/binary-controls) | `browser-bundle` | Native checkbox and switch controls with touch-safe targets |
| `@wornpage/button` | [wornpage/button](https://github.com/wornpage/button) | `browser-bundle` | Buttons and button links with shared variants and disabled states |
| `@wornpage/cmdk` | [wornpage/cmdk](https://github.com/wornpage/cmdk) | `browser-bundle` | Keyboard-first command palette with fuzzy search |
| `@wornpage/command-surfaces` | [wornpage/command-surfaces](https://github.com/wornpage/command-surfaces) | `source` | Compact command toolbars and keyboard hints |
| `@wornpage/data-display` | [wornpage/data-display](https://github.com/wornpage/data-display) | `source` | Badges, chips, avatars, progress, and timelines |
| `@wornpage/date-input` | [wornpage/date-input](https://github.com/wornpage/date-input) | `source` | Native date input with touch-safe styling |
| `@wornpage/dialog` | [wornpage/dialog](https://github.com/wornpage/dialog) | `browser-bundle` | Modal dialog with focus trapping and reduced motion |
| `@wornpage/disclosure` | [wornpage/disclosure](https://github.com/wornpage/disclosure) | `browser-bundle` | Native accordion and collapsible disclosures |
| `@wornpage/drawer` | [wornpage/drawer](https://github.com/wornpage/drawer) | `browser-bundle` | Edge drawer with modal isolation and focus management |
| `@wornpage/form-fields` | [wornpage/form-fields](https://github.com/wornpage/form-fields) | `browser-bundle` | Input, textarea, select, and range controls |
| `@wornpage/layout-surfaces` | [wornpage/layout-surfaces](https://github.com/wornpage/layout-surfaces) | `source` | Panels, containers, cards, dividers, and resizable panes |
| `@wornpage/multi-select` | [wornpage/multi-select](https://github.com/wornpage/multi-select) | `source` | Compact multi-select control with touch-safe defaults |
| `@wornpage/navigation-surfaces` | [wornpage/navigation-surfaces](https://github.com/wornpage/navigation-surfaces) | `source` | Breadcrumb and pagination navigation |
| `@wornpage/receipt` | [wornpage/receipt](https://github.com/wornpage/receipt) | `source` | Undo-capable action receipt cards |
| `@wornpage/scenarios` | [wornpage/scenarios](https://github.com/wornpage/scenarios) | `source` | Shared scenario definitions and validators |
| `@wornpage/segmented-control` | [wornpage/segmented-control](https://github.com/wornpage/segmented-control) | `browser-bundle` | Segmented native radio groups |
| `@wornpage/select-card` | [wornpage/select-card](https://github.com/wornpage/select-card) | `browser-bundle` | Card-based selection with pressed and disabled states |
| `@wornpage/sidebar` | [wornpage/sidebar](https://github.com/wornpage/sidebar) | `browser-bundle` | Collapsible navigation with search and keyboard support |
| `@wornpage/sync` | [wornpage/sync](https://github.com/wornpage/sync) | `source` | Sync-code generation, hashing, and QR encoding |
| `@wornpage/tabs` | [wornpage/tabs](https://github.com/wornpage/tabs) | `browser-bundle` | Roving tabs with stable panels and compact overflow |
| `@wornpage/theme` | [wornpage/theme](https://github.com/wornpage/theme) | `browser-bundle` | Persistent multi-theme CSS custom properties |
| `@wornpage/toast` | [wornpage/toast](https://github.com/wornpage/toast) | `browser-bundle` | Toast notifications with contextual dismissal |
| `@wornpage/undo` | [wornpage/undo](https://github.com/wornpage/undo) | `browser-bundle` | Receipt-oriented undo and redo stack |
| `@wornpage/workflow` | [wornpage/workflow](https://github.com/wornpage/workflow) | `source` | Pack state machine for blocker and next-action flow |
| `@wornpage/cli` | [wornpage/cli](https://github.com/wornpage/cli) | `tooling` | Scaffold + ship new components |

### Tools (`tools/` — monorepo-native)

| Tool | Description |
|---|---|
| `apca-lc` | APCA perceptual contrast calculator (MIT license, zero deps) |
| `public-audit` | Static asset deploy-safety linter |
| `find-unused-css` | Scanner that maps CSS selectors to source files |

## Architecture

- **Standalone repos are canonical.** Each `@wornpage/*` package lives in its own repo.
- **This monorepo mirrors them.** `bun run sync` pulls the latest from each standalone repo.
- **`packages/` is generated — never hand-edit it.** A change made here reaches
  nobody, because nothing installs from this repo. `bun run sync` overwrites it.
- **The demo consumes only mirrored workspaces.** Every internal dependency uses
  `workspace:*`; sibling `file:` paths and floating internal versions are
  rejected by `bun run check:workspace` before CI installs the frozen lockfile.
- **`bun run sync --check` reports drift** without changing anything, and exits
  non-zero when the mirror no longer matches canonical. CI runs it on repository
  changes and daily, so drift is visible even when this mirror is untouched.
- **Tools live here.** `apca-lc`, `public-audit`, `find-unused-css` are monorepo-native.
- **Tests run across everything.** `bun test` validates all packages and tools together.
- **Delivery is checked as a fleet.** `bun run check:components` inspects every
  mirrored component's versioned declaration, exports, local Delivery section,
  release workflow, and source/runtime boundary without rebuilding generated output.
- **The root build is an integration build.** `bun run build` compiles the demo
  against mirrored `workspace:*` sources without generating package `dist/`
  trees inside the mirror.

## Contributing

1. Find the package you want to change in the table above
2. Clone its standalone repo
3. Make your changes, run `bun test`, submit a PR there
4. The monorepo will pick up your changes on the next sync

## License

MIT
