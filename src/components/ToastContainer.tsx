import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-[#121216]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-white" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-rose-400" />}
            {toast.type === 'info' && <Info size={16} className="text-zinc-300" />}
          </div>
          <div className="text-xs text-zinc-200 leading-relaxed font-medium">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
};
