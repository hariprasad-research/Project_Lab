import { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ListSkeleton } from '../../components/feedback/Skeleton';
import { PriorityBadge } from '../../components/ui/Badge';
import { useTaskView, type TaskView } from '../../features/tasks/hooks/useTasks';
import { toggleTaskComplete, deleteTask } from '../../services/taskService';
import { dueSoonLabel } from '../../utils/dates';
import { PRIORITY_LABELS } from '../../constants/enums';
import { useUIStore } from '../../store/uiStore';
import { useToastStore } from '../../store/toastStore';

const views: { key: TaskView; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

export function TasksListPage() {
  const [view, setView] = useState<TaskView>('today');
  const tasks = useTaskView(view);
  const openQuickCapture = useUIStore((s) => s.openQuickCapture);
  const requestConfirm = useUIStore((s) => s.requestConfirm);
  const showToast = useToastStore((s) => s.show);

  const handleDelete = (id: string, title: string) => {
    requestConfirm({
      title: 'Delete this task?',
      description: `"${title}" and any subtasks will be permanently removed.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await deleteTask(id);
        showToast('Task deleted', 'success');
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        action={
          <button
            onClick={() => openQuickCapture('task')}
            aria-label="New task"
            className="rounded-full bg-accent-soft p-2 text-accent-strong"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="flex gap-1.5 overflow-x-auto px-4 py-3 no-scrollbar">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={
              view === v.key
                ? 'shrink-0 rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-white'
                : 'shrink-0 rounded-full bg-surface-sunken px-3.5 py-1.5 text-xs font-medium text-ink-soft'
            }
          >
            {v.label}
          </button>
        ))}
      </div>

      {tasks === undefined ? (
        <ListSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={`No ${view === 'all' ? '' : view} tasks`}
          description={view === 'today' ? 'Nothing due today. Enjoy the clear runway.' : 'Nothing to show in this view yet.'}
          actionLabel={view !== 'completed' ? 'New task' : undefined}
          onAction={view !== 'completed' ? () => openQuickCapture('task') : undefined}
        />
      ) : (
        <div className="flex flex-col divide-y divide-line px-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-3">
              <button
                onClick={() => toggleTaskComplete(task.id)}
                aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                className={
                  task.status === 'completed'
                    ? 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss'
                    : 'h-5 w-5 shrink-0 rounded-full border-2 border-line-strong'
                }
              />
              <div className="min-w-0 flex-1">
                <p
                  className={
                    task.status === 'completed'
                      ? 'truncate text-sm text-ink-faint line-through'
                      : 'truncate text-sm text-ink'
                  }
                >
                  {task.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  {task.dueDate && <span className="text-xs text-ink-faint">{dueSoonLabel(task.dueDate)}</span>}
                  <PriorityBadge priority={task.priority} label={PRIORITY_LABELS[task.priority]} />
                </div>
              </div>
              <button
                onClick={() => handleDelete(task.id, task.title)}
                aria-label="Delete task"
                className="shrink-0 px-1 text-xs text-ink-faint"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
