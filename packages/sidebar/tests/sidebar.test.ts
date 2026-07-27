import { describe, test, expect } from 'bun:test';

function flatten(items: { id: string; children?: any[] }[]): { id: string }[] {
  const result: { id: string }[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children) result.push(...flatten(item.children));
  }
  return result;
}

function filterItems(items: { label: string }[], query: string) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(i => i.label.toLowerCase().includes(q));
}

describe('flatten', () => {
  test('flat list stays flat', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(flatten(items).map(i => i.id)).toEqual(['a', 'b', 'c']);
  });

  test('nested items are flattened', () => {
    const items = [
      { id: 'a' },
      { id: 'b', children: [{ id: 'b1' }, { id: 'b2' }] },
      { id: 'c' },
    ];
    expect(flatten(items).map(i => i.id)).toEqual(['a', 'b', 'b1', 'b2', 'c']);
  });
});

describe('filterItems', () => {
  const items = [{ label: 'Home' }, { label: 'Dashboard' }, { label: 'Settings' }];

  test('empty query returns all', () => {
    expect(filterItems(items, '')).toEqual(items);
  });

  test('matches substring', () => {
    expect(filterItems(items, 'da')).toEqual([{ label: 'Dashboard' }]);
  });

  test('case insensitive', () => {
    expect(filterItems(items, 'SETTINGS')).toEqual([{ label: 'Settings' }]);
  });

  test('no match returns empty', () => {
    expect(filterItems(items, 'zzz')).toEqual([]);
  });
});
