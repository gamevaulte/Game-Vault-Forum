import React from 'react';
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
  if (toasts.length === 0) return null;

  const handleClose = (id: string) => {
    if (onCloseToast) onCloseToast(id);
    else if (onDismiss) onDismiss(id);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-[#141624] border border-purple-500/30 text-white rounded-xl shadow-2xl shadow-purple-950/40 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-200">{toast.message || toast.text}</span>
          <button
            onClick={() => handleClose(toast.id)}
            className="p-1 text-slate-400 hover:text-white transition-colors ml-2"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const Toast = ToastContainer;
