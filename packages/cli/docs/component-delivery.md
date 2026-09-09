# Component delivery

## Ownership

`wornpage/wornpage` owns all active package source under `packages/`. The catalog
uses those workspaces directly. Each component declares contract version 2 and
either `source` or `browser-bundle` delivery in `package.json#wornpage`.

| Delivery | Implementation | Runtime | Packed files |
| --- | --- | --- | --- |
| `source` | `src/` | `src/` | Declared source and consumer types |
| `browser-bundle` | `src/` | Generated `dist/` | Source, types, and built runtime |

The README Delivery section is generated from that declaration. `.gitattributes`
fixes line endings. The verifier rejects missing or inconsistent declarations,
exports, source files, runtime output, and packed entries.

## Develop and verify

Edit source and its behavior tests in the owning package. Do not edit generated
`dist/`. Run `bun run verify:catalog` from the root. The gate tests the workspace,
builds component bundles, packs the declared consumer files, checks archive
integrity, builds the catalog, and runs its browser matrix.

The root GitHub workflow owns package CI. Standalone release callers and the
source-sync workflow have been retired.

## Publish

1. For each changed package, bump its package version and set that package's
   `releaseTag` in `components-release.json` to one shared new dated tag. Leave
   every unchanged package version and release tag untouched. The authored
   schema is version 2; the retired global-tag shape is rejected.
2. Merge the reviewed source change into the default branch after verification.
3. Wait for the successful **Wornpage workspace** run on `main`. That one CI run
   verifies and packs all 26 packages and uploads the whole-catalog packages
   with its eight-stage receipt. Pull requests and failed runs retain diagnostic
   evidence only; they are never release inputs.
4. The repository owner uses a clean checkout of that exact current `main` and
   their local GitHub CLI authentication. From the repository root, run the one
   draft-preparation command:

   ```sh
   bun run scripts/prepare-component-release.ts
   ```

   The helper selects the latest matching completed `workspace.yml` push or
   explicit dispatch on that commit, requires it to be successful, and downloads
   its uniquely named artifact. It rejects wrong
   repository, workflow, branch, event, SHA, attempt, expired or ambiguous
   artifacts, incomplete eight-stage evidence, dirty manifests, and mismatched
   SHA-512 archive bytes before any draft write. It also checks repository
   release immutability and the exact published, non-draft, immutable baseline.
   If the artifact expired, dispatch **Wornpage workspace** on current `main`,
   wait for that same workflow to pass, and run the helper again. Do not rebuild
   packages locally as a release fallback.

   A changed archive must have a changed version and release tag. The helper
   creates no release when all 26 packages are unchanged; otherwise it creates
   a draft containing the full manifest and only the changed archives.
5. Review that draft's assets, then publish it. Replace `TAG` below with the new
   tag assigned to the changed packages:

   ```sh
   gh release edit TAG --repo wornpage/wornpage --draft=false
   ```
6. In a follow-up reviewed change, set `baselineReleaseTag` to the newly
   published tag. That release's schema-2 manifest is the next full-catalog
   comparison checkpoint even though unchanged package entries continue to
   name their older immutable release tags. Do not rewrite those entries.

The immutability preflight requires
[repository Administration read permission](https://docs.github.com/en/rest/repos/repos#check-if-immutable-releases-are-enabled-for-a-repository),
which is unavailable to the standard
[`GITHUB_TOKEN`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions).
The hosted workflow therefore uses read-only repository access; publication
stays with the owner-authenticated helper. Do not bypass its
immutability check or replace it with a previous release's status.

Release immutability must be enabled. Publishing locks the assets and tag. The
manifest records each package version, release tag, source path, SHA-512
integrity, and the clean build commit. The top-level commit identifies the
verified full-catalog build; an unchanged package's own `releaseTag` remains its
published source and archive provenance. Draft preparation rejects a dirty tree,
mismatched source metadata, reused tag, or mismatched artifact. Historical
published schema-1 manifests remain readable as immutable baselines, but new
authored configuration and generated manifests use schema 2. A release is never
overwritten.

## Consume

Install the archive shown by the catalog and commit the consumer's updated
lockfile. The `@wornpage` npm scope is not a supported distribution path.
Normal package assets are named `wornpage-<name>-<version>.tgz`.

The initial consolidated release also contains byte-identical transport archives
for existing Production Projects dependencies. Their filenames contain the
original full source commit. They are historical compatibility assets, not a
second development path; see the [migration record](../../../docs/component-migration.md).
