const NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End']);

export function nextNavFocusIndex(key: string, currentIndex: number, linkCount: number): number | null {
	if (!NAVIGATION_KEYS.has(key) || linkCount <= 0) return null;
	if (key === 'Home') return 0;
	if (key === 'End') return linkCount - 1;
	if (currentIndex < 0) return 0;
	if (key === 'ArrowDown') return Math.min(currentIndex + 1, linkCount - 1);
	return Math.max(currentIndex - 1, 0);
}
