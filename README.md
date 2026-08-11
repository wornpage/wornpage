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
| `@wornpage/button` | [wornpage/button](https://github.com/wornpage/button) | `browser-bundle` | Buttons and button-links with shared variants and disabled states |
| `@wornpage/sidebar` | [wornpage/sidebar](https://github.com/wornpage/sidebar) | `browser-bundle` | Collapsible sidebar with groups, search, favorites, keyboard nav |
| `@wornpage/cmdk` | [wornpage/cmdk](https://github.com/wornpage/cmdk) | `browser-bundle` | Command palette - fuzzy search, keyboard-first |
| `@wornpage/toast` | [wornpage/toast](https://github.com/wornpage/toast) | `browser-bundle` | Toast notification web component |
| `@wornpage/theme` | [wornpage/theme](https://github.com/wornpage/theme) | `browser-bundle` | Theme switcher with 8 palettes |
| `@wornpage/undo` | [wornpage/undo](https://github.com/wornpage/undo) | `browser-bundle` | Undo/redo stack |
| `@wornpage/date-input` | *(not yet a standalone GitHub repo)* | `source` | Date input wrapper |
| `@wornpage/multi-select` | *(not yet a standalone GitHub repo)* | `source` | Multi-select control |
| `@wornpage/workflow` | [wornpage/workflow](https://github.com/wornpage/workflow) | `source` | Pack state machine - blockers, next-action, energy |
| `@wornpage/receipt` | [wornpage/receipt](https://github.com/wornpage/receipt) | `source` | Action receipt card with undo support |
| `@wornpage/sync` | [wornpage/sync](https://github.com/wornpage/sync) | `source` | Sync code generation, hashing, and QR encoding |
| `@wornpage/scenarios` | [wornpage/scenarios](https://github.com/wornpage/scenarios) | `source` | Shared scenario definitions and validators |
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
