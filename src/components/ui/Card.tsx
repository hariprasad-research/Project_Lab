import clsx from 'clsx';
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

const cardBase = 'rounded-[var(--radius-lg)] bg-surface border border-line shadow-[var(--shadow-card)] p-4 text-left';

/** Static card container - use for content that isn't itself interactive. */
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(cardBase, className)} {...props}>
      {children}
    </div>
  );
}

/** Interactive card - renders as a real <button> for tap feedback and a11y. */
export function CardButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(cardBase, 'w-full active:scale-[0.99] transition-transform', className)} {...props}>
      {children}
    </button>
  );
}
