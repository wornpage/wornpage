# Component source consolidation

`wornpage/wornpage` owns all active component source under `packages/`, the
catalog under `demo/`, and release verification under `packages/cli/`. The
standalone repositories are historical sources. Their final imported revisions
are recorded in [standalone-provenance.json](standalone-provenance.json).

The generated mirror and its scheduled fetch workflow have been removed.
Package changes are reviewed here and released together as immutable GitHub
release assets. No current build fetches package source from the old repositories.

## Compatibility retained

```text
Compatibility retained:
- Consumer: Published Projects WebMCP Challenge edition, its protected private development copy, and Afterlist.
- Owner: Wornpage.
- Removal condition: Every supported edition has stopped depending on the historical GitHub archive URLs; the protected challenge edition cannot be changed by this migration.
- Test coverage: The migration checks the protected manifest SHA and anonymous access to every retained archive. Projects production separately verifies clean installation and exact archive integrity before any retirement.
- Why hard cutover is unsafe now: The published consumers contain fixed GitHub URLs. Keeping their fourteen source repositories public preserves those existing installs without editing the submitted project.
```

The retained repositories are alert, async-states, binary-controls, button,
command-surfaces, data-display, dialog, disclosure, form-fields, layout-surfaces,
receipt, segmented-control, tabs, and toast. They remain publicly readable as
historical archives. New development belongs in this repository.

```text
Compatibility retained:
- Consumer: Production Projects, whose ten remaining component sources are moving to private history repositories.
- Owner: Wornpage.
- Removal condition: Production deliberately upgrades those dependencies to normal component release packages.
- Test coverage: SHA-512 identity of each historical archive is preserved, and the migrated production lockfile passes a clean install, consumer-contract checks, and the production asset build.
- Why hard cutover is unsafe now: A source upgrade would mix behavior changes into a repository migration. The immutable release retains byte-identical historical archives for the current production pins.
```

Historical transport assets retain the original component slug and full source
commit in their filename. Their checksums and original URLs are published in
the release's transport manifest. These assets are explicitly for existing
consumers; new applications use the normal packages shown by the catalog.
