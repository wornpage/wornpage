export interface ToastItem {
  id: string;
  message: string;
  kind?: 'info' | 'error' | 'success';
}

export interface ToastProps {
  message: string;
  kind?: 'info' | 'error' | 'success';
  dismissLabel?: string;
  ondismiss?: () => void;
  duration?: number;
}
