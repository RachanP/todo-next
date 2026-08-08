import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200';
      case 'error':
        return 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200';
      case 'info':
      default:
        return 'bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-500/40 text-sky-700 dark:text-sky-200';
    }
  };

  return (
    <div
      className={`p-3.5 rounded-xl border shadow-xl flex items-center justify-between space-x-3 pointer-events-auto text-xs font-medium animate-slideUp ${getBg()}`}
    >
      <div className="flex items-center space-x-2.5">
        {getIcon()}
        <span>{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
