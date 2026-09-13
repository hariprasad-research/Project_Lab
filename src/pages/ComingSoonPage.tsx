import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/feedback/EmptyState';

export function ComingSoonPage({
  title,
  icon,
  description,
}: {
  title: string;
  icon: LucideIcon;
  description: string;
}) {
  return (
    <div>
      <PageHeader title={title} back />
      <EmptyState
        icon={icon}
        title={`${title} is on the way`}
        description={description}
      />
    </div>
  );
}
