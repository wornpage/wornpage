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

1. Set package versions and a new dated tag in `components-release.json`.
2. Merge the reviewed source change into the default branch after verification.
3. Run **Component release verification** from the default branch. It verifies
   and packs the workspace, then uploads archives and per-stage evidence as an
   Actions artifact. A failed run can contain partial output; its artifacts are
   diagnostic evidence, not a published release.
4. The repository owner uses a clean checkout of current `main` and their local
   GitHub CLI authentication. From the repository root, run:

   ```sh
   bun install --frozen-lockfile &&
   bunx playwright install chromium &&
   bun run verify:catalog &&
   bun run scripts/prepare-component-release.ts
   ```

   The chain stops before draft preparation if any prerequisite fails.
   The existing helper checks current `main`, a clean source tree, enabled
   release immutability, and the manifest's package inventory and integrity
   before creating a draft with the archives and `component-manifest.json`.
5. Review that draft's assets, then publish it. Replace `TAG` below with the
   tag declared in `components-release.json`:

   ```sh
   gh release edit TAG --repo wornpage/wornpage --draft=false
   ```

The immutability preflight requires
[repository Administration read permission](https://docs.github.com/en/rest/repos/repos#check-if-immutable-releases-are-enabled-for-a-repository),
which is unavailable to the standard
[`GITHUB_TOKEN`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions).
The hosted workflow therefore uses read-only repository access for verification;
publication stays with the owner-authenticated helper. Do not bypass its
immutability check or replace it with a previous release's status.

Release immutability must be enabled. Publishing locks the assets and tag. The
manifest records each package version, SHA-512 integrity, and the source commit;
draft preparation rejects a dirty source tree or mismatched artifact. A release is
never overwritten. Use a new tag for the next release.

## Consume

Install the archive shown by the catalog and commit the consumer's updated
lockfile. The `@wornpage` npm scope is not a supported distribution path.
Normal package assets are named `wornpage-<name>-<version>.tgz`.

The initial consolidated release also contains byte-identical transport archives
for existing Production Projects dependencies. Their filenames contain the
original full source commit. They are historical compatibility assets, not a
second development path; see the [migration record](../../../docs/component-migration.md).
