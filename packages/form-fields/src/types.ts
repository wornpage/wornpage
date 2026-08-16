import type { HTMLInputAttributes, HTMLSelectAttributes, HTMLTextareaAttributes } from 'svelte/elements';

export interface InputProps {
  type?: HTMLInputAttributes['type'];
  placeholder?: string;
  value?: string;
  oninput?: (event: Event) => void;
  onchange?: (event: Event) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onblur?: (event: FocusEvent) => void;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: HTMLInputAttributes['autocomplete'];
  inputmode?: HTMLInputAttributes['inputmode'];
  spellcheck?: boolean;
  rows?: number;
  id?: string;
  class?: string;
  [key: string]: unknown;
}

export interface TextareaProps {
  value?: string;
  placeholder?: string;
  rows?: number;
  oninput?: (event: Event) => void;
  onchange?: (event: Event) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onblur?: (event: FocusEvent) => void;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: HTMLTextareaAttributes['autocomplete'];
  spellcheck?: boolean;
  id?: string;
  class?: string;
  [key: string]: unknown;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onchange?: (event: Event) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  id?: string;
  class?: string;
  [key: string]: unknown;
}

export interface RangeProps {
  value?: number;
  valueText?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  suffix?: string;
  oninput?: (event: Event) => void;
  onchange?: (event: Event) => void;
  disabled?: boolean;
  class?: string;
  [key: string]: unknown;
}
