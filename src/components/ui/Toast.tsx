import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, Loader2, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toastConfig = {
  info: {
    icon: Info,
    bg: 'bg-sky-50 border-sky-200',
    iconColor: 'text-sky-600',
    textColor: 'text-sky-800',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-800',
  },
  error: {
    icon: XCircle,
    bg: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
    textColor: 'text-rose-800',
  },
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const config = toastConfig[toast.type];
  const Icon = toast.loading ? Loader2 : config.icon;

  useEffect(() => {
    if (toast.loading) return;
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.loading, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg w-full sm:max-w-xs ${config.bg}`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 mt-0.5 ${config.iconColor} ${toast.loading ? 'animate-spin' : ''}`}
      />
      <p className={`text-sm font-medium flex-1 ${config.textColor}`}>{toast.message}</p>
      {!toast.loading && (
        <button
          onClick={() => onDismiss(toast.id)}
          className={`shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
};

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 flex flex-col gap-2 items-stretch sm:items-end no-print">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
