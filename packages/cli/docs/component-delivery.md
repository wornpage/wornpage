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
3. Run **Component release verification** from the default branch. It verifies
   and packs all 26 packages, then uploads the whole-catalog packages and
   per-stage evidence as an Actions artifact. This full denominator is a QA
   contract, not the publication subset. A failed run can contain partial
   output; its artifacts are diagnostic evidence, not a published release.
4. The repository owner uses a clean checkout of current `main` and their local
   GitHub CLI authentication. From the repository root, run:

   ```sh
   bun install --frozen-lockfile &&
   bunx playwright install chromium &&
   bun run verify:catalog &&
   bun run scripts/prepare-component-release.ts
   ```

   The chain stops before draft preparation if any prerequisite fails.
   The helper checks current `main`, a clean source tree, repository release
   immutability, and the exact published, non-draft, immutable baseline release.
   It compares every package version, release tag, source path, and SHA-512
   archive digest with that baseline. A changed archive must also have a changed
   version and release tag. The helper creates no release when all 26 packages
   are unchanged; otherwise it creates a draft containing the full manifest and
   only the changed archives.
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
The hosted workflow therefore uses read-only repository access for verification;
publication stays with the owner-authenticated helper. Do not bypass its
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
