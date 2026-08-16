export interface NavigationClick {
	altKey: boolean;
	button: number;
	ctrlKey: boolean;
	defaultPrevented: boolean;
	metaKey: boolean;
	shiftKey: boolean;
}

export function shouldInterceptNavigationClick(event: NavigationClick, hasHandler: boolean): boolean {
	return hasHandler
		&& !event.defaultPrevented
		&& event.button === 0
		&& !event.altKey
		&& !event.ctrlKey
		&& !event.metaKey
		&& !event.shiftKey;
}
