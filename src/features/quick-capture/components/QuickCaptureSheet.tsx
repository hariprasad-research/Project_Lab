import { CheckSquare, FolderKanban, Lightbulb, StickyNote, FlaskConical } from 'lucide-react';
import { Sheet } from '../../../components/ui/Sheet';
import { useUIStore, type QuickCaptureType } from '../../../store/uiStore';
import { QuickTaskForm } from './QuickTaskForm';
import { QuickProjectForm } from './QuickProjectForm';

const typeMeta: Record<Exclude<QuickCaptureType, null>, { label: string; icon: typeof CheckSquare }> = {
  task: { label: 'Task', icon: CheckSquare },
  project: { label: 'Project', icon: FolderKanban },
  idea: { label: 'Idea', icon: Lightbulb },
  note: { label: 'Note', icon: StickyNote },
  research: { label: 'Research', icon: FlaskConical },
};

export function QuickCaptureSheet() {
  const { quickCaptureType, openQuickCapture, closeQuickCapture } = useUIStore();

  const titles: Record<Exclude<QuickCaptureType, null>, string> = {
    task: 'New task',
    project: 'New project',
    idea: 'New idea',
    note: 'New note',
    research: 'New research entry',
  };

  return (
    <Sheet
      open={quickCaptureType !== null}
      onClose={closeQuickCapture}
      title={quickCaptureType ? titles[quickCaptureType] : 'Quick capture'}
    >
      {quickCaptureType && (
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {(Object.keys(typeMeta) as Array<Exclude<QuickCaptureType, null>>).map((key) => {
            const { label, icon: Icon } = typeMeta[key];
            const active = quickCaptureType === key;
            return (
              <button
                key={key}
                onClick={() => openQuickCapture(key)}
                className={
                  active
                    ? 'flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-medium text-white'
                    : 'flex shrink-0 items-center gap-1.5 rounded-full bg-surface-sunken px-3.5 py-2 text-xs font-medium text-ink-soft'
                }
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {quickCaptureType === 'task' && <QuickTaskForm onDone={closeQuickCapture} />}
      {quickCaptureType === 'project' && <QuickProjectForm onDone={closeQuickCapture} />}
      {(quickCaptureType === 'idea' || quickCaptureType === 'note' || quickCaptureType === 'research') && (
        <div className="rounded-[var(--radius-md)] bg-surface-sunken p-4 text-sm text-ink-soft">
          {typeMeta[quickCaptureType].label} capture is coming in the next build phase — Projects and Tasks are
          fully wired up for now.
        </div>
      )}
    </Sheet>
  );
}
