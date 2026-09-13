import clsx from 'clsx';
import type { Priority } from '../../constants/enums';

type Tone = 'neutral' | 'accent' | 'amber' | 'rust' | 'moss';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-ink-soft',
  accent: 'bg-accent-soft text-accent-strong',
  amber: 'bg-amber-soft text-amber',
  rust: 'bg-rust-soft text-rust',
  moss: 'bg-moss-soft text-moss',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={clsx('inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-1 text-xs font-medium leading-none', toneClasses[tone])}>
      {children}
    </span>
  );
}

const priorityTone: Record<Priority, Tone> = {
  low: 'neutral',
  medium: 'accent',
  high: 'amber',
  critical: 'rust',
};

export function PriorityBadge({ priority, label }: { priority: Priority; label: string }) {
  return <Badge tone={priorityTone[priority]}>{label}</Badge>;
}
