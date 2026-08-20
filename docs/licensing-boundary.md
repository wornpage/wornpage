# Wornpage Licensing Boundary

This document is an engineering policy for the Wornpage mirror. It is not
legal advice. A copyright or licensing change is a decision for the relevant
business owner, with qualified legal review where appropriate.

## Current scope and evidence

The root `README.md` describes this repository as a mirror: standalone package
repositories are canonical, `packages/` is generated, and the demo consumes
the mirrored workspaces. The root and inspected package manifests currently
declare `MIT`; the root `package.json` also declares `MIT`. This document does
not change those declarations, package metadata, generated files, or canonical
repositories.

The inventory below is based on the package table in the root README and the
package manifests in `packages/*/package.json` and `tools/*/package.json`.

## Inventory by boundary

### Generic UI primitives and presentation helpers

These packages are ordinary reusable interface building blocks. Their names
and descriptions cover controls, layout, navigation, feedback, display, or
presentation behavior rather than a Wornpage product's private business rules:

| Family | Packages |
| --- | --- |
| Feedback and overlays | `@wornpage/alert`, `@wornpage/dialog`, `@wornpage/disclosure`, `@wornpage/drawer`, `@wornpage/toast` |
| Controls and input | `@wornpage/binary-controls`, `@wornpage/button`, `@wornpage/date-input`, `@wornpage/form-fields`, `@wornpage/multi-select`, `@wornpage/segmented-control`, `@wornpage/select-card` |
| Navigation and command UI | `@wornpage/cmdk`, `@wornpage/command-surfaces`, `@wornpage/navigation-surfaces`, `@wornpage/sidebar`, `@wornpage/tabs` |
| Layout, state, and display | `@wornpage/async-states`, `@wornpage/data-display`, `@wornpage/layout-surfaces`, `@wornpage/receipt`, `@wornpage/theme`, `@wornpage/undo` |

The grouping is a product-boundary assessment, not a claim that a package has
no protectable expression or that MIT is inappropriate. A component is not
"unsafe" merely because it is MIT-licensed.

### Generic development tooling

`@wornpage/cli` scaffolds, builds, and publishes components. The monorepo-native
tools `apca-lc`, `public-audit`, and `find-unused-css` provide contrast
calculation, deploy-safety checks, and CSS analysis. These are reusable tools,
not hosted product data or private application logic. Their manifests declare
MIT as well.

### Product-specific or product-adjacent logic requiring an owner gate

The following packages are the deliberate review boundary because their
descriptions encode application concepts or sharing behavior rather than only
rendering primitives:

| Package | Canonical repository | Current description boundary | Prospective owner decision |
| --- | --- | --- | --- |
| `@wornpage/workflow` | [github.com/wornpage/workflow](https://github.com/wornpage/workflow) | Pack state machine, including blocker/next/doneWhen filtering and ordering | Keep MIT; dual-license future releases; use a source-available license for future releases; or move unreleased product logic private |
| `@wornpage/sync` | [github.com/wornpage/sync](https://github.com/wornpage/sync) | Demo state sync-code generation, hashing, QR encoding, and no-account sharing behavior | Same four options |
| `@wornpage/scenarios` | [github.com/wornpage/scenarios](https://github.com/wornpage/scenarios) | Shared scenario definitions and validators for Wornpage demo apps | Same four options |

This table is not a recommendation to relicense today. Before any new release
of one of these packages, the owner should record: (1) whether the release is
still generic infrastructure or contains product differentiation, (2) who
owns all contributed copyright, (3) whether dependencies permit the proposed
license, (4) whether existing users need a migration notice, and (5) the exact
license and version to apply to that release.

The four options mean:

1. **Keep MIT:** continue granting broad reuse under the existing policy.
2. **Dual-license future releases:** offer MIT plus a second license under
   terms selected by the owner; state which files and versions are covered.
3. **Source-available future releases:** publish source with defined use
   restrictions that are not represented as open-source permission.
4. **Move unreleased product logic private:** keep only unreleased,
   owner-controlled product code out of the public package; do not imply that
   previously distributed copies have become private.

Any change is prospective and version-specific. A future release may have a
different license only after the copyright owners make that business/legal
decision and update the canonical package's notices and release materials.

## What the MIT license grants

The authoritative MIT text grants a recipient permission, free of charge, to
deal in the software without restriction, including to use, copy, modify,
merge, publish, distribute, sublicense, and sell copies. The recipient must
keep the copyright notice and permission notice in copies or substantial
portions of the software. The license also states that the software is
provided without warranty and that its authors or copyright holders are not
liable for claims or damages to the extent stated in the license.

Source: [OSI MIT License](https://opensource.org/license/mit).

For copies already distributed under MIT, those recipients retain the grants
made by the license attached to those copies. A later owner decision cannot
turn an already received MIT copy into a different license or retroactively
withdraw those permissions. A future release can be offered under different
terms only for material whose copyright owners have authority to do so; it
does not rewrite the terms of prior releases.

## Keep separate concepts separate

* **Copyright:** identifies rights in source code, generated output, artwork,
  documentation, and contributions. Copyright ownership and contributor
  authority must be established separately from the package's license field.
* **License:** grants permissions for specified copyrighted material. MIT
  permission does not automatically cover unrelated assets, dependencies,
  hosted services, data, trademarks, or private code.
* **Trademark:** names, logos, package names, and product marks may have
  separate usage rules. MIT permission to copy code is not permission to imply
  endorsement or use marks as branding.
* **Hosted service and data:** an MIT package does not grant access to a
  Wornpage-hosted service, credentials, infrastructure, telemetry, user
  content, datasets, or operational data. Those are governed by their own
  terms, contracts, privacy rules, and access controls.
* **Private app logic:** code kept in an unreleased application or service is
  outside the public package license unless the owner publishes it under a
  license. Moving future unreleased logic private does not revoke MIT rights
  in prior distributed versions.

## Release gate

Before publishing a future `workflow`, `sync`, or `scenarios` release, the
owner should approve one explicit choice: **MIT**, **dual-license**,
**source-available**, or **private for unreleased logic**. The release must
identify the covered version and files, preserve required third-party notices,
and avoid suggesting that a license change is a technical safety fix. The
decision should be recorded in the canonical standalone repository; this
mirror follows it on its next synchronization.
