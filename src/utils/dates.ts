import {
  isToday,
  isPast,
  isTomorrow,
  formatDistanceToNow,
  format,
  startOfDay,
} from 'date-fns';

export function isOverdue(dueDate?: string, completedAt?: string): boolean {
  if (!dueDate || completedAt) return false;
  return isPast(startOfDay(new Date(dueDate))) && !isToday(new Date(dueDate));
}

export function isDueToday(dueDate?: string): boolean {
  if (!dueDate) return false;
  return isToday(new Date(dueDate));
}

export function dueSoonLabel(dueDate?: string): string | null {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isPast(d)) return `Overdue · ${format(d, 'MMM d')}`;
  return format(d, 'MMM d');
}

export function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatDate(iso?: string, pattern = 'MMM d, yyyy'): string {
  if (!iso) return '';
  return format(new Date(iso), pattern);
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good evening';
}
