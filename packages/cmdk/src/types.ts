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
  open?: boolean;
  items: CmdkItem[];
  placeholder?: string;
  onclose?: () => void;
}
