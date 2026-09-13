import { NavLink } from 'react-router-dom';
import { LayoutGrid, FolderKanban, CheckSquare, Search, Settings } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { to: '/', label: 'Home', icon: LayoutGrid, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban, end: false },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, end: false },
  { to: '/search', label: 'Search', icon: Search, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-surface/95 backdrop-blur safe-bottom"
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-accent' : 'text-ink-faint',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
