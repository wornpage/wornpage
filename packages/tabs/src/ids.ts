function safeDomPart(value: string): string {
	const normalized: string[] = [];
	let replacingUnsafeRun = false;
	let lastContentLength = 0;

	for (const character of value) {
		const codePoint = character.codePointAt(0) ?? -1;
		const isAsciiLetter =
			(codePoint >= 65 && codePoint <= 90) ||
			(codePoint >= 97 && codePoint <= 122);
		const isAsciiDigit = codePoint >= 48 && codePoint <= 57;
		const isSafeCharacter = isAsciiLetter || isAsciiDigit || character === '_' || character === '-';

		if (isSafeCharacter) {
			replacingUnsafeRun = false;
			if (character === '-' && normalized.length === 0) continue;
			normalized.push(character);
			if (character !== '-') lastContentLength = normalized.length;
		} else {
			if (normalized.length > 0 && !replacingUnsafeRun) normalized.push('-');
			replacingUnsafeRun = true;
		}
	}

	normalized.length = lastContentLength;
	return normalized.join('') || 'tab';
}

export function tabDomIds(baseId: string, tabId: string): { tabId: string; panelId: string } {
	const part = safeDomPart(tabId);
	return {
		tabId: `${baseId}-tab-${part}`,
		panelId: `${baseId}-panel-${part}`,
	};
}
