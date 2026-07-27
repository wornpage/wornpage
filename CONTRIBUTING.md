# Contributing to Wornpage

Thanks for your interest! Here's how things work.

## Repo structure

```
wornpage (this monorepo — mirror/showcase)
├── packages/          ← mirrored from standalone repos
├── tools/             ← monorepo-native dev tools
└── scripts/sync.ts    ← pulls latest from standalone repos
```

**Standalone repos are canonical.** Each `@wornpage/*` package has its own repo.
This monorepo mirrors them so you can browse, test, and refactor across packages.

## Finding where to contribute

| You want to... | Go to |
|---|---|
| Fix a component bug | The component's standalone repo |
| Add a new component | `bun run new <name>` in the monorepo, then publish standalone |
| Improve a dev tool | The monorepo `tools/` directory |
| Cross-package refactor | The monorepo (test everything together) |

## Workflow

### For standalone package changes
1. Clone the package's repo: `git clone https://github.com/wornpage/<name>.git`
2. Make changes, run tests: `bun test`
3. Submit PR to that repo
4. After merge, the monorepo picks it up on next sync

### For monorepo-native changes (tools, scripts, docs)
1. Clone the monorepo: `git clone https://github.com/wornpage/wornpage.git`
2. Make changes, run tests: `bun test`
3. Submit PR to the monorepo

## Conventions

### Every component package must have:
- `src/index.ts` — barrel export
- `src/Component.svelte` — the Svelte 5 component
- `tests/test.ts` — at minimum a "renders without error" test
- `package.json` — with `@wornpage/` scope, `main`, `svelte`, `exports`

### Every tool must have:
- `src/index.ts` — library export
- `package.json` — with description and keywords
- Tests if applicable

### CSS theming
Components use `--cockpit-*` CSS custom properties. Fall back to sensible defaults
for standalone use. See `@wornpage/sidebar` for the reference pattern.

## Running tests

```bash
cd wornpage
bun install
bun test          # 60+ tests across all packages and tools
```

## Questions?

Open an issue on the relevant standalone repo, or on the monorepo if it's a
cross-cutting concern.
