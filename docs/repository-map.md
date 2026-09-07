# Wornpage repository map

| Start here | Role | Canonical source |
| --- | --- | --- |
| [Projects](https://projects-webmcp-extension.pages.dev/webmcp-challenge) | The application and published WebMCP Challenge edition. | [`projects-webmcp-extension`](https://github.com/wornpage/projects-webmcp-extension), preserved independently. |
| [Components](https://wornpage-components.pages.dev) | One Svelte interface library, catalog, and development toolkit. | This repository: [`packages/`](../packages), [`demo/`](../demo), and [`tools/`](../tools). |
| [WebMCP Conformance](https://github.com/wornpage/webmcp-conformance) | Framework-neutral descriptor, authority, lifecycle, receipt, and consumer validation. | `webmcp-conformance`. |
| [PR Machine](https://github.com/wornpage/projects-pr-machine) | Verified draft PR delivery for reviewed agent work. | `projects-pr-machine`. |

## Components

All 26 component and supporting packages are developed here. Package names and
versions are explicit in [`components-release.json`](../components-release.json).
Use the [setup guide](getting-started.md) to install immutable release archives,
and [CONTRIBUTING.md](../CONTRIBUTING.md) to change the library.

The standalone repositories are historical sources. Fourteen remain publicly
readable for fixed dependencies in the published Projects edition and other
existing consumers. The remaining twelve package repositories and the former
standalone CLI can retire to private GitHub history after their consumers have
migrated. The [migration record](component-migration.md) documents that boundary.

## Other repositories

[`.github`](https://github.com/wornpage/.github) owns shared community files.
Upstream forks are labeled separately and are not additional Wornpage products.

The catalog, components, and conformance toolkit use MIT. PR Machine uses
AGPL-3.0-only. Consult each repository's license for the code you use.
