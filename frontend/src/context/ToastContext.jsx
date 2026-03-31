import { createContext, useContext, useMemo, useState } from 'react';
import ToastViewport from '../components/ui/ToastViewport';

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ title, description, tone = 'default' }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, description, tone }]);
    window.setTimeout(() => removeToast(id), 3200);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}
