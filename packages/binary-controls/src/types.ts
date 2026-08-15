export interface BinaryControlProps {
  checked?: boolean;
  onchange?: (event: Event) => void;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export type CheckboxProps = BinaryControlProps;
export type SwitchProps = BinaryControlProps;
