# @wornpage/scenarios

> Part of **[Wornpage Components](https://github.com/wornpage/wornpage#component-library)**.
> [Browse the catalog](https://wornpage-components.pages.dev) · [Setup guide](https://github.com/wornpage/wornpage/blob/main/docs/getting-started.md) · [Wornpage overview](https://github.com/wornpage/wornpage)

Shared scenario definitions and validators for wornpage demo apps. Pure
TypeScript, zero dependencies, no Svelte required.

This is the one package in the set that imports cleanly in a bun or node server
process as well as in a browser — it is data and validators, nothing else.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/wornpage/blob/main/packages/cli/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Source use

This package is not published to npm. Install the immutable package archive linked by the [catalog](https://wornpage-components.pages.dev). The `@wornpage/scenarios`
import below resolves from the installed archive; it does not resolve from the public npm registry.

## Usage

```ts
import {
  SCENARIOS,
  VALID_SCENARIOS,
  WELCOME_METHODS,
  METHOD_CARDS,
  type ScenarioCatalogEntry,
  type ScenarioId,
  type ScenarioDef
} from '@wornpage/scenarios';

VALID_SCENARIOS.has('sales');   // true — use this to validate untrusted input
SCENARIOS[0].label;             // 'Default' — use this to render selectors
WELCOME_METHODS[0].label;       // 'Daily Operations'
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `SCENARIOS` | `ScenarioCatalogEntry[]` | Canonical ids, labels, descriptions, and launch routes |
| `VALID_SCENARIOS` | `Set<string>` | Every valid scenario id |
| `WELCOME_METHODS` | `ScenarioDef[]` | Method cards for the welcome screen |
| `METHOD_CARDS` | `ScenarioDef[]` | Compact cards for the dashboard strip |
| `ScenarioCatalogEntry` | type | `{ id, label, desc, route }` |
| `ScenarioId` | type | Union of canonical scenario ids |
| `ScenarioDef` | type | `{ id, label, desc, icon, route }` |

## Scenario ids

`default`, `due-view`, `empty`, `healthy`, `onboarding`, `review`,
`ai-prompts`, `ai-evals`, `ops-day`, `sales`, `ai-companion`, `demo`

`VALID_SCENARIOS` is the authority; it mirrors `server/src/constants.js` in the
consuming app, so validate against it rather than hardcoding the list.

## Tests

```bash
bun test
```

## License

MIT
