import type { NavItem } from './types.js';

// Pure section/navigation helpers for the sidebar, split out of Sidebar.svelte
// so the open/selected logic is unit-testable (bun:test cannot render Svelte
// components). These drive two behaviors that shipped wrong once:
//
//  1. PER-SECTION open state — every group previously bound to one shared
//     `moreOpen` boolean, so toggling any section title flipped ALL sections
//     open/closed together.
//  2. ACTIVE-SECTION selection — the section containing the active page must
//     read as selected (and stay open), so the current route is never hidden
//     inside a collapsed group.

// The ids of every section (an item with children).
export function sectionIds(items: NavItem[]): string[] {
  const ids: string[] = [];
  for (const item of items) {
    if (item.children) ids.push(item.id);
  }
  return ids;
}

// The section holding the active page, or null when the active href is not
// inside any section (top-level pages, the root, or a bare id match).
export function sectionForActiveHref(items: NavItem[], activeHref: string): NavItem | null {
  if (!activeHref) return null;
  return items.find((item) => item.children?.some((c) => c.href === activeHref)) || null;
}

// Initial open set:
//   - persisted === null (no stored state / fresh install) → every section open
//   - persisted array (user's saved choice) → EXACTLY those ids, authoritative.
// The active-section effect re-opens the section holding the current page, so
// a user-collapsed section can never hide the route they are on.
export function initialOpenSections(items: NavItem[], persisted: string[] | null): Set<string> {
  if (!Array.isArray(persisted)) {
    return new Set(sectionIds(items));
  }
  return new Set(persisted);
}

// The section that must be forced open because it holds the active page, or
// null. Pure decision helper for the sidebar's active-section effect — the
// effect must only WRITE when this returns a section that is NOT already in
// the open set, or the write re-triggers the effect (a fresh Set on every
// run loops until Svelte throws effect_update_depth_exceeded).
export function activeSectionToForceOpen(items: NavItem[], activeHref: string, open: Set<string>): NavItem | null {
  if (!activeHref) return null;
  const parent = sectionForActiveHref(items, activeHref);
  if (!parent || open.has(parent.id)) return null;
  return parent;
}
