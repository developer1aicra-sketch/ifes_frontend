import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';

const ToastContext = createContext(null);

const DEFAULT_AUTO_CLOSE = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, options = {}) => {
    const id = Math.random().toString(36).slice(2);
    const autoClose = options.autoClose ?? DEFAULT_AUTO_CLOSE;
    setToasts((prev) => [...prev, { id, type, message, autoClose }]);
    if (autoClose > 0) {
      setTimeout(() => removeToast(id), autoClose);
    }
    return id;
  }, [removeToast]);

  const toast = useMemo(
    () => ({
      success: (message, options) => addToast('success', message, options),
      error: (message, options) => addToast('error', message, options),
      info: (message, options) => addToast('info', message, options),
      warning: (message, options) => addToast('warning', message, options),
    }),
    [addToast]
  );

  const value = { toasts, removeToast, toast };
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx.toast;
}

export function useToastState() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toasts: [], removeToast: () => {} };
  return { toasts: ctx.toasts, removeToast: ctx.removeToast };
}
