export interface SelectCardProps {
	label: string;
	description?: string;
	pressed?: boolean;
	disabled?: boolean;
	onclick?: (event: MouseEvent) => void;
	[key: string]: unknown;
}
