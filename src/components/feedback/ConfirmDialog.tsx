import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui/Button';

export function ConfirmDialog() {
  const { confirmRequest, clearConfirm } = useUIStore();

  const handleConfirm = async () => {
    if (!confirmRequest) return;
    await confirmRequest.onConfirm();
    clearConfirm();
  };

  return (
    <AnimatePresence>
      {confirmRequest && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearConfirm}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={confirmRequest.title}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-sheet)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h3 className="text-base font-semibold text-ink">{confirmRequest.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{confirmRequest.description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={clearConfirm}>
                Cancel
              </Button>
              <Button
                variant={confirmRequest.destructive ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirm}
              >
                {confirmRequest.confirmLabel ?? 'Confirm'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
