import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message?: string;
  text?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
  onCloseToast?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, onCloseToast }) => {
  const handleClose = (id: string) => {
    if (onCloseToast) onCloseToast(id);
    else if (onDismiss) onDismiss(id);
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        handleClose(t.id);
      }, 3500)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-3">
      {toasts.slice(-3).map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#0e1122]/95 border border-white/15 text-white rounded-xl shadow-lg shadow-black/50 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="text-xs font-medium text-slate-200 truncate">{toast.message || toast.text}</span>
          </div>
          <button
            onClick={() => handleClose(toast.id)}
            className="p-1 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const Toast = ToastContainer;
