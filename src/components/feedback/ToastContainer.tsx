import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, type ToastVariant } from '../../store/toastStore';

const iconFor: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorFor: Record<ToastVariant, string> = {
  success: 'text-moss',
  error: 'text-rust',
  warning: 'text-amber',
  info: 'text-accent',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+12px)] z-[100] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconFor[toast.variant];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-card)] border border-line"
            >
              <Icon size={18} className={colorFor[toast.variant]} />
              <span className="text-sm text-ink">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
