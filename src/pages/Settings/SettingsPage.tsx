import { useRef, useState } from 'react';
import { Sun, Moon, Monitor, Download, Upload, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { useToastStore } from '../../store/toastStore';
import { exportBackup, downloadBackup, validateBackupFile, restoreBackup, clearAllData, type ImportValidation } from '../../services/backupService';
import type { ThemeMode } from '../../constants/enums';

const themeOptions: { key: ThemeMode; label: string; icon: typeof Sun }[] = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Monitor },
];

export function SettingsPage() {
  const { mode, setMode } = useThemeStore();
  const requestConfirm = useUIStore((s) => s.requestConfirm);
  const showToast = useToastStore((s) => s.show);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<ImportValidation | null>(null);

  const handleExport = async () => {
    const backup = await exportBackup();
    downloadBackup(backup);
    showToast('Backup downloaded', 'success');
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      const validation = validateBackupFile(raw);
      setPendingImport(validation);
      if (!validation.valid) showToast(validation.error ?? 'Invalid backup file', 'error');
    } catch {
      showToast("Couldn't read that file — it may not be valid JSON.", 'error');
    }
  };

  const runImport = (mode: 'replace' | 'merge') => {
    if (!pendingImport?.parsed) return;
    requestConfirm({
      title: mode === 'replace' ? 'Replace all current data?' : 'Merge backup into current data?',
      description:
        mode === 'replace'
          ? 'Every project, task, idea, note, and research entry currently on this device will be permanently replaced by the backup contents.'
          : 'Records from the backup will be added. Where the same item exists in both, the most recently edited version is kept.',
      confirmLabel: mode === 'replace' ? 'Replace data' : 'Merge',
      destructive: mode === 'replace',
      onConfirm: async () => {
        await restoreBackup(pendingImport.parsed!, mode);
        setPendingImport(null);
        showToast('Backup restored', 'success');
      },
    });
  };

  const handleClearData = () => {
    requestConfirm({
      title: 'Clear all data?',
      description: 'This permanently deletes every project, task, idea, note, and research entry on this device. Export a backup first if you might need this data again.',
      confirmLabel: 'Clear everything',
      destructive: true,
      onConfirm: async () => {
        await clearAllData();
        showToast('All data cleared', 'success');
      },
    });
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <section className="px-4 pt-4">
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Appearance</h2>
        <div className="flex gap-2">
          {themeOptions.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={
                mode === key
                  ? 'flex flex-1 flex-col items-center gap-1.5 rounded-[var(--radius-md)] border-2 border-accent bg-accent-soft py-3 text-xs font-medium text-accent-strong'
                  : 'flex flex-1 flex-col items-center gap-1.5 rounded-[var(--radius-md)] border border-line py-3 text-xs font-medium text-ink-soft'
              }
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">Data management</h2>
        <div className="flex flex-col gap-2.5">
          <Button variant="secondary" onClick={handleExport} className="justify-start">
            <Download size={17} /> Export backup
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="justify-start">
            <Upload size={17} /> Import backup
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />

          {pendingImport?.valid && pendingImport.counts && (
            <div className="rounded-[var(--radius-md)] border border-line bg-surface-sunken p-3.5 text-sm">
              <p className="mb-2 font-medium text-ink">Backup preview</p>
              <ul className="mb-3 space-y-0.5 text-ink-soft">
                {Object.entries(pendingImport.counts)
                  .filter(([, count]) => count > 0)
                  .map(([key, count]) => (
                    <li key={key}>
                      {count} {key}
                    </li>
                  ))}
              </ul>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => runImport('merge')}>
                  Merge
                </Button>
                <Button size="sm" variant="danger" onClick={() => runImport('replace')}>
                  Replace all
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingImport(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Button variant="danger" onClick={handleClearData} className="mt-2 justify-start">
            <Trash2 size={17} /> Clear all data
          </Button>
        </div>
      </section>

      <section className="mt-6 px-4 pb-6">
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">About</h2>
        <p className="text-sm text-ink-soft">
          PocketLab v0.1 · A local-first workspace for projects, tasks, ideas, notes, and research. All data stays
          on this device.
        </p>
      </section>
    </div>
  );
}
