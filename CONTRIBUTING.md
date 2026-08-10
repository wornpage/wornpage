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
| Add a new component | Scaffold and publish its standalone repo, then sync the monorepo |
| Improve a dev tool | The monorepo `tools/` directory |
| Cross-package verification or tooling | The monorepo; component edits still ship from standalone repos |

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
- One canonical implementation under `src/`
- A v2 `package.json#wornpage` delivery declaration
- The generated Delivery section and deterministic `.gitattributes`
- The shared release-contract workflow from `@wornpage/cli`

The [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md)
defines source-only and generated browser-bundle packages. Run
`wornpage verify --frozen-dist` in the standalone repository before shipping.

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
bun run check:workspace
bun run sync --check
bun test
```

## Questions?

Open an issue on the relevant standalone repo, or on the monorepo if it's a
cross-cutting concern.
