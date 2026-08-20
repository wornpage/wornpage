# Native Control Policy

## Scope and terminology

Wornpage is a browser-rendered Svelte component library. Svelte wrappers may
package, style, and coordinate browser controls, but they do not turn those
controls into iOS or Android views.

This distinction matters when comparing Wornpage with Power Apps device-
optimized screens. Power Apps can pass screen UI state to native iOS or
Android controls. When a control is unsupported by that native path, the
screen falls back to a WebView. That is a native-host rendering strategy, not
Web Components: the UI state is rendered by platform controls where supported,
and by web content where it is not. See [Power Apps device-optimized screens]
and [supported device-optimized controls].

[Power Apps device-optimized screens]: https://learn.microsoft.com/en-us/power-apps/mobile/optimize-for-devices-overview
[supported device-optimized controls]: https://learn.microsoft.com/en-us/power-apps/mobile/optimize-for-devices-controls

Web Components change packaging and encapsulation (custom elements, lifecycle,
and optionally shadow DOM); they do not change the rendering engine. A
`<worn-input>` or `<worn-dialog>` remains browser content. True native
rendering would require a separately maintained native host/bridge and a
separately maintained map from Wornpage control contracts to native controls.
That is outside this library's browser-rendered architecture.

## Default implementation rule

Prefer semantic HTML primitives under Svelte wrappers:

- `input`, with the appropriate `type`, `inputmode`, `autocomplete`, and
  constraints;
- `button`, including `type="button"` for non-submit actions;
- `select` for single selection and native multi-select where that interaction
  is appropriate;
- `textarea` for multiline text;
- `details`/`summary` for disclosure where a modal or custom focus model is
  not required; and
- `dialog` for modal behavior where the browser's dialog model is suitable.

Styling must not replace semantics, keyboard behavior, form participation,
focus behavior, or the browser's input affordances without an explicit,
tested reason. A custom visual treatment is acceptable when the native element
still owns interaction and accessibility state.

## Mobile acceptance criteria

Every editable control and interactive surface must satisfy these checks in
the rendered Wornpage application:

1. Editable text is at least `16px` on iOS. This is an **empirical Safari
   requirement** to prevent focus zoom; it is not a claim that all browsers
   impose the same rule.
2. App touch targets are at least `44px` by `44px`, including icon-only
   actions, close buttons, radio/checkbox labels, and navigation actions.
3. Fixed or viewport-edge UI accounts for `env(safe-area-inset-top)`,
   `env(safe-area-inset-right)`, `env(safe-area-inset-bottom)`, and
   `env(safe-area-inset-left)` as applicable. Content and controls must remain
   reachable around notches, status bars, and the home indicator.
4. Inputs use the correct semantic `type`, a suitable `inputmode`, and an
   intentional `autocomplete` value. Do not disable useful browser or password
   manager behavior by default.
5. `:focus-visible` (or an equivalent keyboard-visible focus treatment) is
   clearly visible against every supported theme.
6. `prefers-reduced-motion: reduce` removes or substantially reduces movement,
   including transitions used by dialogs, drawers, sidebars, and state changes.
7. Backdrops, decorative layers, and positioned wrappers do not intercept
   pointer or touch hits intended for a control. Overlay hit-testing must be
   deliberate: use `pointer-events` and event boundaries so an invisible
   layer cannot steal interaction.
8. Test the actual interaction in current iOS Safari and an iOS PWA
   standalone context, in addition to desktop browser tests. Include keyboard
   focus, the on-screen keyboard, viewport changes, safe areas, scrolling, and
   dismissal/return-focus behavior where relevant.

## Control mapping

| Control area | Wornpage mapping | Policy requirements |
| --- | --- | --- |
| Binary controls | `@wornpage/binary-controls` `Checkbox` and `Switch` | Keep the native checkbox/switch input as the state owner. The visible label and its full touch surface must activate that input; preserve checked, disabled, accessible-name, focus, and change semantics. |
| Form fields | `@wornpage/form-fields` `Input`, `Textarea`, `Select`, and `Range` | Preserve the underlying `input`, `textarea`, `select`, or range input. Forward `type`, `inputmode`, `autocomplete`, labels, constraints, read-only, and disabled state. Apply the 16px editable-text and 44px touch rules on mobile. |
| Date input | `@wornpage/date-input` `DateInput` | Use the native date input and its picker semantics. Keep the normalized date value and native `min`, `max`, `step`, required, and disabled behavior. Do not replace it with a simulated picker without a demonstrated browser requirement. |
| Segmented control | `@wornpage/segmented-control` `SegmentedControl` | Use the native radio group and arrow-key behavior. Keep a real form name/value, group labeling, visible focus, and a 44px activation area for each segment. |
| Multi-select | `@wornpage/multi-select` `MultiSelect` | Preserve the native multi-select/listbox semantics, selected values, disabled options, accessible naming, keyboard behavior, and visible row sizing. Verify touch selection on iOS rather than assuming desktop listbox behavior. |
| Dialog | `@wornpage/dialog` `Dialog` | Use dialog semantics with an accessible name, bounded focus while open, Escape/backdrop/close behavior when dismissible, return focus to the trigger, and reduced motion. Keep modal content inside safe areas and prevent background hit-testing while open. |
| Drawer | `@wornpage/drawer` `Drawer` | Treat the drawer as a focused modal surface on mobile: preserve focus management, dismissal, inert background, viewport/keyboard tracking, safe-area padding, and a reachable 44px close action. The backdrop must not steal intended panel hits. |
| Sidebar | `@wornpage/sidebar` `Sidebar` | Keep navigation as links/buttons with native activation and keyboard navigation. A responsive rail-to-drawer presentation remains web-rendered; its mobile drawer state must meet the dialog-like focus, safe-area, reduced-motion, and hit-testing rules. |
| Button | `@wornpage/button` `Button`, `IconButton`, and `ReactionButton` | Render a real `button` or `a` according to action semantics. Set the correct button type, expose disabled/pressed state, require an accessible label for icon-only actions, preserve visible focus, and provide a 44px target on touch devices. |
| Disclosure | `@wornpage/disclosure` `Accordion` and `Collapsible` | **Disposition: native primitive preferred.** `Accordion` must keep native `details`/`summary` open-close behavior. `Collapsible` may use a native `button` with `aria-expanded` and `aria-controls` when its controlled state is required. Keep the 44px trigger, visible focus, reduced motion, and a reachable contained panel; do not present either browser-rendered wrapper as a native mobile view. |
| Select card | `@wornpage/select-card` `SelectCard` | **Disposition: semantic button, not a native selection control.** Keep a real `button` as the activation and selected-state owner with `aria-pressed`, disabled behavior, an accessible name, visible focus, and a 44px touch target. Use radio inputs instead when the card represents a form-associated mutually exclusive choice; do not claim that the card button is native-rendered. |
| Tabs | `@wornpage/tabs` `Tabs` | **Disposition: custom composite with ARIA semantics.** Keep a named `tablist`, real tab buttons, roving keyboard behavior, and stable tab-to-`tabpanel` IDs. Overflow controls must be real labeled buttons, meet the 44px target rule, respect reduced motion, and not disrupt page scrolling; this remains browser-rendered rather than a native tab-bar view. |
| Command palette | `@wornpage/cmdk` `Cmdk` | **Disposition: browser dialog with native input and buttons.** Keep native `dialog` modal behavior, a semantic search input, real result buttons, explicit focus entry and return, and deliberate Escape, backdrop, close, and selection dismissal. Keep the dialog inside safe areas, prevent background hit-testing while open, provide 44px close/result targets, and reduce motion; it is not a native command palette. |
| Navigation surfaces | `@wornpage/navigation-surfaces` `Breadcrumb`, `NavigationList`, and `Pagination` | **Disposition: native links and buttons preferred.** Breadcrumb and destination-list navigation must use native anchors in named navigation landmarks. Pagination must use real buttons with current-page state and a distinct landmark label where needed. Preserve visible focus, 44px touch targets, reduced motion, hostile-label containment, and reachable compact layouts; no wrapper is a native navigation view. |
| Command surfaces | `@wornpage/command-surfaces` `Toolbar` and `Kbd` | **Disposition: semantic grouping and display only.** `Toolbar` must remain a named `role="group"` wrapper that does not replace its slotted controls' native behavior or normal Tab sequence; `Kbd` must render `kbd` text only. Consumers supply real controls with their own labels, focus treatment, disabled state, and 44px touch targets. Do not treat either browser-rendered surface as a native toolbar. |

## Review gate for new controls

Before adding a custom control, document why the semantic primitive is
insufficient and identify the browser behaviors that remain owned by native
elements. Verify the mobile acceptance criteria in real iOS Safari and PWA
testing, including overlays and focus return. A Web Component wrapper alone is
not evidence that a control is native-rendered and is not a substitute for a
native host/bridge implementation.
