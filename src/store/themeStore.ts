import { create } from 'zustand';
import { db, ensureSettings } from '../db';
import type { ThemeMode } from '../constants/enums';

interface ThemeState {
  mode: ThemeMode;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
}

function applyDomClass(mode: ThemeMode) {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = mode === 'dark' || (mode === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', shouldBeDark);
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  hydrated: false,
  hydrate: async () => {
    const settings = await ensureSettings();
    applyDomClass(settings.theme);
    set({ mode: settings.theme, hydrated: true });

    // React to OS-level theme changes while in "system" mode.
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const current = useThemeStore.getState().mode;
      if (current === 'system') applyDomClass('system');
    });
  },
  setMode: async (mode) => {
    applyDomClass(mode);
    set({ mode });
    await db.settings.update('singleton', { theme: mode });
  },
}));
