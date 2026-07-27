# Wornpage

> Svelte 5 component library + development toolkit.
> **This monorepo is a mirror.** Individual packages have their own repos.
> Import them directly: `bun add @wornpage/sidebar`

## Quick start — browsing

```bash
git clone https://github.com/wornpage/wornpage.git
cd wornpage
bun install
bun test          # 60 tests across all packages
```

## Quick start — using in your app

```bash
# Import from standalone repos (canonical source):
bun add @wornpage/sidebar    # or: github:wornpage/sidebar
bun add @wornpage/cmdk
bun add @wornpage/toast
```

## What's inside

### Components (`packages/` — mirrored from standalone repos)

| Package | Standalone repo | Description |
|---|---|---|
| `@wornpage/sidebar` | [wornpage/sidebar](https://github.com/wornpage/sidebar) | Collapsible sidebar with groups, search, favorites, keyboard nav |
| `@wornpage/cmdk` | [wornpage/cmdk](https://github.com/wornpage/cmdk) | Command palette — fuzzy search, keyboard-first |
| `@wornpage/toast` | [wornpage/toast](https://github.com/wornpage/toast) | Toast notification web component |
| `@wornpage/theme` | [wornpage/theme](https://github.com/wornpage/theme) | Theme switcher with 8 palettes |
| `@wornpage/undo` | [wornpage/undo](https://github.com/wornpage/undo) | Undo/redo stack |
| `@wornpage/workflow` | [wornpage/workflow](https://github.com/wornpage/workflow) | Pack state machine — blockers, next-action, energy |
| `@wornpage/receipt` | [wornpage/receipt](https://github.com/wornpage/receipt) | Action receipt card with undo support |
| `@wornpage/sync` | [wornpage/sync](https://github.com/wornpage/sync) | Sync code generation and hashing |
| `@wornpage/cli` | [wornpage/cli](https://github.com/wornpage/cli) | Scaffold + ship new components |

### Tools (`tools/` — monorepo-native)

| Tool | Description |
|---|---|
| `apca-lc` | APCA perceptual contrast calculator (MIT license, zero deps) |
| `public-audit` | Static asset deploy-safety linter |
| `find-unused-css` | Scanner that maps CSS selectors to source files |

## Architecture

- **Standalone repos are canonical.** Each `@wornpage/*` package lives in its own repo.
- **This monorepo mirrors them.** `bun run sync` pulls the latest from each standalone repo.
- **Tools live here.** `apca-lc`, `public-audit`, `find-unused-css` are monorepo-native.
- **Tests run across everything.** `bun test` validates all packages and tools together.

## Contributing

1. Find the package you want to change in the table above
2. Clone its standalone repo
3. Make your changes, run `bun test`, submit a PR there
4. The monorepo will pick up your changes on the next sync

## License

MIT
