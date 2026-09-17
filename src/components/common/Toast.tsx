import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppState();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />,
        };

        const borderColors = {
          info: 'border-cyan-500/40 bg-slate-900/90 shadow-cyan-950/40',
          success: 'border-emerald-500/40 bg-slate-900/90 shadow-emerald-950/40',
          warning: 'border-amber-500/40 bg-slate-900/90 shadow-amber-950/40',
          error: 'border-rose-500/50 bg-rose-950/90 shadow-rose-950/50',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-slideInRight ${
              borderColors[toast.type]
            }`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide">
                  {toast.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-100 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
