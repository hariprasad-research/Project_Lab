import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from '../store/themeStore';

export function App() {
  const hydrate = useThemeStore((s) => s.hydrate);
  const hydrated = useThemeStore((s) => s.hydrated);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hydrate().catch((e) => setError(e instanceof Error ? e.message : 'Failed to start'));
  }, [hydrate]);

  if (error) {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center gap-2 bg-paper p-6 text-center">
        <p className="text-base font-semibold text-ink">Something went wrong starting PocketLab</p>
        <p className="text-sm text-ink-soft">{error}</p>
      </div>
    );
  }

  if (!hydrated) return null;

  return <RouterProvider router={router} />;
}
