import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

export function FAB() {
  const openQuickCapture = useUIStore((s) => s.openQuickCapture);

  return (
    <motion.button
      onClick={() => openQuickCapture('task')}
      aria-label="Quick capture"
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-[calc(64px+env(safe-area-inset-bottom)+16px)] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[var(--shadow-card)]"
    >
      <Plus size={26} />
    </motion.button>
  );
}
