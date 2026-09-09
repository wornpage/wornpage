# Portfolio case study: human-controlled AI delivery

Wornpage demonstrates accessible interfaces and human-controlled AI workflows.
The public examples show how a person can inspect the work, approve a bounded
action, and retain the final delivery decision.

## Demonstrated controls

| Control | Demonstrated work | Verifiable example |
| --- | --- | --- |
| Bounded authority | WebMCP declarations are page-owned and describe available actions and lifecycle limits. | [WebMCP Conformance](https://github.com/wornpage/webmcp-conformance) |
| Human approval | The public challenge lets agents inspect visible evidence and prepare drafts for human review. It is a frozen challenge submission, separate from the private production app. | [WebMCP challenge demo](https://projects-webmcp-extension.pages.dev/webmcp-challenge) |
| Inspectable evidence | Action receipts and lifecycle behavior are explicit validation concerns. | [Conformance source and checks](https://github.com/wornpage/webmcp-conformance) |
| Reviewed delivery | PR Machine produces a verified draft pull request; the repository owner controls merge or close. | [PR Machine workflow evidence](https://github.com/wornpage/projects-pr-machine/blob/main/docs/challenge-extension-case-study.md) |
| Accessible operation | The Svelte component library includes keyboard support, visible focus, reduced-motion behavior, and theming. | [Component catalog](https://wornpage-components.pages.dev) · [Setup guide](getting-started.md) |

## Content-governance boundary

These examples support a content-governance workflow: review criteria,
escalation paths, and approval records can be applied around generated output.
They do not certify legal compliance, replace brand or legal review, or
automatically validate every generated result. Those requirements remain an
organization-specific policy and human decision.

## Application-ready summary

I build accessible Svelte interfaces and human-controlled AI workflows that make authority, evidence, and final approval inspectable. My public work demonstrates bounded agent actions, action receipts, reviewed draft delivery, keyboard access, reduced-motion behavior, and theming. It is intentionally clear about the boundary: these controls support governance and review, but legal, compliance, and brand decisions remain with accountable people and organization-specific policy.
