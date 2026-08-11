import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function ToastPopup() {
  const { toast, hideToast } = useCartStore();

  if (!toast || !toast.message) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <AnimatePresence>
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs sm:max-w-sm px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-md text-xs font-black ${
            isError
              ? 'bg-rose-900/90 border-rose-500/50 text-rose-100'
              : isInfo
              ? 'bg-sky-900/90 border-sky-500/50 text-sky-100'
              : 'bg-slate-900/95 border-slate-700 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isError ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : isInfo ? (
              <Info className="w-5 h-5 text-sky-400 shrink-0" />
            ) : (
              <div className="w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            )}
            <span className="truncate">{toast.message}</span>
          </div>

          <button
            onClick={hideToast}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
