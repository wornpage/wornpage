export interface SegmentedOption {
	id: string;
	label: string;
}
export interface SegmentedControlProps {
	options: SegmentedOption[];
	active?: string;
	name: string;
	label?: string;
	onchange?: (id: string) => void;
}
