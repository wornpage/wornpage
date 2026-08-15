function safeDomPart(value: string): string {
	return value.trim().replace(/[^a-zA-Z0-9_-]+/gu, '-').replace(/^-+|-+$/gu, '') || 'tab';
}

export function tabDomIds(baseId: string, tabId: string): { tabId: string; panelId: string } {
	const part = safeDomPart(tabId);
	return {
		tabId: `${baseId}-tab-${part}`,
		panelId: `${baseId}-panel-${part}`,
	};
}
