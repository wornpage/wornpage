export interface TabOption {
	id: string;
	label: string;
	tabId?: string;
	panelId?: string;
}

export interface TabsProps {
	active?: string;
	tabs: TabOption[];
	onchange?: (id: string) => void;
	id?: string;
	label?: string;
}
