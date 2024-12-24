import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback(({ type, message, duration = 3000 }: ToastOptions) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast };
}