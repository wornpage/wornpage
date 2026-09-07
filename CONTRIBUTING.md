# Contributing to Wornpage

This repository owns the component library, catalog, release tooling, and three
development tools. Edit the owning source directly here.

| Change | Location |
| --- | --- |
| Component behavior | `packages/<name>/src/` and its tests |
| Catalog examples and navigation | `demo/` |
| Component release verification | `packages/cli/` and `scripts/pack-components.ts` |
| Development tools | `tools/` |

## Verification

```sh
bun install --frozen-lockfile
bunx playwright install chromium
bun run verify:catalog
```

Use Bun 1.3.14 and Node 24.18.0. The gate checks workspace dependencies,
delivery declarations, and Theme consumer types, runs package tests, builds and
packs releases, checks Toast keyboard focus in a real browser, builds the catalog,
and runs the browser matrix. It stops on a
failed stage and preserves logs under `output/verify-catalog/`.

## Package conventions

Each component has one implementation under `src/`, a v2 delivery declaration,
the matching README Delivery section, and deterministic `.gitattributes`.
Browser bundles are generated under the ignored package `dist/` directory.
The root workflow owns CI for every package; nested standalone workflows are
retired. See [component delivery](packages/cli/docs/component-delivery.md).

The host owns the semantic `--worn-*` CSS properties described in
[the catalog contract](docs/catalog-contract.md). Preserve each package's
documented keyboard, focus, containment, and reduced-motion behavior.

## Adding a component

Run `bun run new <name>` from this root. Add the package version to
`components-release.json`, add a catalog entry and example, and run the full gate
before opening a PR. The CLI does not create standalone repositories or publish
to npm.

## Releases

Update package versions and the dated release tag in `components-release.json`.
Submit and merge the change here after verification. The **Component release
verification** workflow verifies and packs that source and uploads evidence.
The owner prepares a draft from a clean checkout of current `main`, using their local
GitHub authentication and the existing `scripts/prepare-component-release.ts`
helper, then reviews and publishes that draft. Follow the commands and permission
requirements in [component delivery](packages/cli/docs/component-delivery.md#publish).
Consumer applications deliberately update to the published archive and its
lockfile integrity.

Historical standalone repositories are explained in
[the migration record](docs/component-migration.md). New issues and PRs belong
in this repository.
