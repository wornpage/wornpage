export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface MultiSelectProps {
	value?: string[];
	onchange?: (event: Event) => void;
	options: MultiSelectOption[];
	disabled?: boolean;
	class?: string;
	size?: number;
	[key: string]: unknown;
}
