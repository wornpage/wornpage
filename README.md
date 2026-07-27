# Wornpage

> Svelte 5 component library + development toolkit.
> One repo. One `bun install`. All the pieces.

## What's inside

### Components (`packages/`)

| Package | Description |
|---|---|
| `@wornpage/sidebar` | Collapsible sidebar with groups, search, favorites, drag-reorder, keyboard nav |
| `@wornpage/cmdk` | Command palette — fuzzy search, keyboard-first |
| `@wornpage/toast` | Toast notification web component |
| `@wornpage/theme` | Theme switcher with 8 palettes |
| `@wornpage/undo` | Undo/redo stack |
| `@wornpage/workflow` | Pack state machine — blockers, next-action, energy |
| `@wornpage/receipt` | Action receipt card with undo support |
| `@wornpage/sync` | Sync code generation and hashing |
| `@wornpage/cli` | Scaffold + ship new components |

### Tools (`tools/`)

| Tool | Description |
|---|---|
| `apca-lc` | APCA perceptual contrast calculator (MIT license) |
| `public-audit` | Static asset deploy-safety linter |
| `find-unused-css` | Scanner that maps CSS selectors to source files |

## Quick start

```bash
git clone https://github.com/wornpage/wornpage.git
cd wornpage
bun install
bun test
```

## Create a new component

```bash
bun run new my-component
cd packages/my-component
# Edit src/WornMyComponent.svelte
bun run --filter @wornpage/my-component test
```

## Ship a component

```bash
cd packages/my-component
bunx wornpage ship
```

## Using in your app

Each package is also published to npm individually:

```bash
bun add @wornpage/sidebar
```

Or use the monorepo directly with workspaces.

## Architecture

Every component follows the same pattern:
- **`src/Component.svelte`** — the Svelte 5 component
- **`src/index.ts`** — barrel export
- **`tests/test.ts`** — bun tests
- **`dist/`** — built output (committed, for CDN/git-based installs)

Component packages use `--cockpit-*` CSS custom properties for theming.
Web components register as custom elements (e.g. `<worn-sidebar>`).

## License

MIT
