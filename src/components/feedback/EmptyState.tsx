import type { LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-surface-sunken text-ink-faint">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="max-w-[26ch] text-sm text-ink-soft">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
