export interface CmdkItem {
  id: string;
  label: string;
  hint?: string;
  keywords?: string[];
  group?: string;
  icon?: string;
  onSelect: () => void;
}

export interface CmdkProps {
  items: CmdkItem[];
  placeholder?: string;
  onclose?: (event: Event) => void;
}

export interface CmdkHandle {
  open(): void;
}
