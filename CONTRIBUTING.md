# Contributing to Wornpage

Thanks for your interest! Here's how things work.

## Repo structure

```
wornpage (this monorepo — mirror/showcase)
├── packages/          ← mirrored from standalone repos
├── tools/             ← monorepo-native dev tools
└── scripts/sync.ts    ← fetches reviewed commits from the manifest
```

**Standalone repos are canonical.** Each `@wornpage/*` package has its own repo.
This monorepo mirrors reviewed commits so you can browse, test, and refactor
across packages without trusting mutable default branches.

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
4. After merge, review the standalone commit and update its exact revision in
   `scripts/component-repositories.ts`
5. Run `bun run sync`, review the generated mirror diff, then install and test
   in separate commands

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

The [component delivery contract](https://github.com/wornpage/cli/blob/d65813ff4f5668e8ab96fef8f744e47dbfeb7e3c/docs/component-delivery.md)
defines source-only and generated browser-bundle packages. Use a pinned CLI
checkout to verify a standalone repository before shipping.

### Every tool must have:
- `src/index.ts` — library export
- `package.json` — with description and keywords
- Tests if applicable

### CSS theming
Components use the semantic `--worn-*` CSS custom properties documented in
[`docs/catalog-contract.md`](docs/catalog-contract.md). The host owns those
tokens; standalone components retain their documented fallbacks.

## Running tests

```bash
cd wornpage
bun install
bunx playwright install chromium # one-time local browser install; Node 24.18.0 required
bun run verify:catalog
```

The catalog verifier stops at the first failed stage, preserves that exit code,
and records later stages as skipped. Inspect `output/verify-catalog/latest.json`
and its referenced per-run stdout/stderr logs; do not rerun merely to replace a
failed receipt.

`check:components` is the fleet gate. It checks every mirrored package's
delivery declaration, exports, README, and release workflow in one pass;
package tests remain responsible for component behavior.

## Questions?

Open an issue on the relevant standalone repo, or on the monorepo if it's a
cross-cutting concern.
