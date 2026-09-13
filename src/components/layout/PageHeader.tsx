import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)] backdrop-blur">
      {back && (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-1.5 rounded-full p-1.5 text-ink-soft hover:bg-surface-sunken"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="truncate text-lg font-semibold text-ink">{title}</h1>
        {subtitle && <p className="truncate text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
