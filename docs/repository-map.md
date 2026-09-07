# Wornpage repository map

Wornpage connects a work-tracking application, its interface building blocks,
browser-tool validation, and a tool for delivering reviewed code. Start with the
part that matches what you want to do.

## Public entry points

| Start here | Purpose | Source ownership |
| --- | --- | --- |
| [Projects](https://projects-webmcp-extension.pages.dev/webmcp-challenge) | Try the application and its page-owned WebMCP tools. | [`projects-webmcp-extension`](https://github.com/wornpage/projects-webmcp-extension) contains the published challenge edition. |
| [Components](https://wornpage.pages.dev) | Explore the interface library and copy a reviewed install command. | [`wornpage`](https://github.com/wornpage/wornpage) owns the catalog and its three development tools; standalone repositories own each component package. |
| [WebMCP Conformance](https://github.com/wornpage/webmcp-conformance) | Validate tool descriptors, authority boundaries, lifecycle fixtures, and receipts. | `webmcp-conformance` owns the framework-neutral validation packages and an independent component consumer check. |
| [PR Machine](https://github.com/wornpage/projects-pr-machine) | Deliver reviewed work as a verified draft PR with explicit owner control of merging. | `projects-pr-machine` owns the beta controller and its integration documentation. |

The conformance toolkit is independently usable. It does not require Wornpage
Components, and the component consumer check does not classify WebMCP authority.
PR Machine is a development tool; installing components does not require it.

## One component library, separate package sources

The [component index](../README.md#component-library) lists 26 component and
supporting packages plus the release CLI. The live catalog is the entry point
for the whole library. Standalone repositories provide stable package addresses,
package-specific history, tests, and contribution locations.

| Repository group | Includes | Go here to change it |
| --- | --- | --- |
| Controls and inputs | alert, async-states, binary-controls, button, date-input, form-fields, multi-select, segmented-control, select-card | The named component repository. |
| Navigation and layout | cmdk, command-surfaces, dialog, disclosure, drawer, layout-surfaces, navigation-surfaces, sidebar, tabs | The named component repository. |
| Feedback, display, and workflow | data-display, receipt, scenarios, sync, theme, toast, undo, workflow | The named package repository. |
| Package delivery | [`cli`](https://github.com/wornpage/cli) | The shared release verifier, scaffolder, and reusable release workflow. |
| Catalog and development tools | [`wornpage`](https://github.com/wornpage/wornpage) | Catalog UI; `apca-lc`, `public-audit`, and `find-unused-css`. |

Use the [component setup guide](getting-started.md) for installation. Releases
are consumed through reviewed Git commit archives; the `@wornpage` npm scope is
not currently a supported installation path.

The catalog mirrors exact commits from
[`scripts/component-repositories.ts`](../scripts/component-repositories.ts).
Make package changes in their standalone source repository, then deliberately
promote the reviewed commit into the catalog. Files under `packages/` are generated
mirrors and must not be edited by hand.

## Why the package repositories are public

Public consumers install pinned GitHub archives directly, and catalog validation
fetches the reviewed source commits. Component CI also calls the public reusable
workflow in `cli`. Those repository addresses are part of the delivery contract.
Hiding or deleting a source repository would break anonymous installs or checks
that still use it.

The published Projects challenge edition pins 14 of these component repositories.
Its source and dependency pins remain independent of changes to the portfolio
overview. Any future consolidation must preserve those public archive addresses
for as long as the published edition depends on them.

## Shared files and upstream forks

The [`.github`](https://github.com/wornpage/.github) repository holds shared
community files. It is supporting account infrastructure. Upstream forks such
as `explore` and `voice-typer-powershell` are separate from the four Wornpage
entry points above.

## Licenses

The catalog, components, and conformance toolkit use MIT. PR Machine uses
AGPL-3.0-only. Consult each repository's license for the code you use.
