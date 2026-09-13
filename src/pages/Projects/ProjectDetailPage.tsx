import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, CheckSquare, Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { PriorityBadge, Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useProject } from '../../features/projects/hooks/useProjects';
import { useTasksByProject } from '../../features/tasks/hooks/useTasks';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants/enums';
import { formatDate } from '../../utils/dates';
import { archiveProject, countLinkedItems, deleteProjectPermanently } from '../../services/projectService';
import { toggleTaskComplete } from '../../services/taskService';
import { useUIStore } from '../../store/uiStore';
import { useToastStore } from '../../store/toastStore';

type Tab = 'overview' | 'tasks';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = useProject(id);
  const tasks = useTasksByProject(id);
  const [tab, setTab] = useState<Tab>('overview');
  const navigate = useNavigate();
  const requestConfirm = useUIStore((s) => s.requestConfirm);
  const openQuickCapture = useUIStore((s) => s.openQuickCapture);
  const showToast = useToastStore((s) => s.show);

  if (!project) {
    return (
      <div>
        <PageHeader title="Project" back />
        <EmptyState icon={CheckSquare} title="Project not found" description="It may have been deleted or is still loading." />
      </div>
    );
  }

  const handleDelete = async () => {
    const counts = await countLinkedItems(project.id);
    const totalLinked = counts.tasks + counts.notes + counts.milestones;
    requestConfirm({
      title: 'Delete this project?',
      description:
        totalLinked > 0
          ? `This project has ${counts.tasks} task(s), ${counts.notes} note(s), and ${counts.milestones} milestone(s). Linked tasks and notes will be kept but unlinked from this project. This can't be undone.`
          : "This can't be undone.",
      confirmLabel: 'Delete permanently',
      destructive: true,
      onConfirm: async () => {
        await deleteProjectPermanently(project.id);
        showToast('Project deleted', 'success');
        navigate('/projects');
      },
    });
  };

  const handleArchive = () => {
    requestConfirm({
      title: 'Archive this project?',
      description: 'You can find it again by filtering for archived projects. Nothing is deleted.',
      confirmLabel: 'Archive',
      onConfirm: async () => {
        await archiveProject(project.id);
        showToast('Project archived', 'success');
        navigate('/projects');
      },
    });
  };

  return (
    <div>
      <PageHeader title={project.name} subtitle={STATUS_LABELS[project.status]} back />

      <div className="flex gap-2 border-b border-line px-4">
        {(['overview', 'tasks'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              tab === t
                ? 'border-b-2 border-accent px-1 py-2.5 text-sm font-medium capitalize text-accent'
                : 'border-b-2 border-transparent px-1 py-2.5 text-sm font-medium capitalize text-ink-faint'
            }
          >
            {t === 'tasks' ? `Tasks (${tasks?.length ?? 0})` : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-5 p-4">
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={project.priority} label={PRIORITY_LABELS[project.priority]} />
            <Badge>{STATUS_LABELS[project.status]}</Badge>
            {project.category && <Badge>{project.category}</Badge>}
          </div>

          {project.description && <p className="text-sm leading-relaxed text-ink-soft">{project.description}</p>}

          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Progress</span>
              <span className="text-ink-soft">{project.progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {project.startDate && (
              <div>
                <div className="text-ink-faint">Started</div>
                <div className="text-ink">{formatDate(project.startDate)}</div>
              </div>
            )}
            {project.targetDate && (
              <div>
                <div className="text-ink-faint">Target</div>
                <div className="text-ink">{formatDate(project.targetDate)}</div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            <button onClick={handleArchive} className="text-left text-sm font-medium text-ink-soft">
              Archive project
            </button>
            <button onClick={handleDelete} className="flex items-center gap-1.5 text-left text-sm font-medium text-rust">
              <Trash2 size={15} /> Delete permanently
            </button>
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div>
          <div className="flex justify-end px-4 pt-4">
            <button
              onClick={() => openQuickCapture('task')}
              className="flex items-center gap-1 text-sm font-medium text-accent"
            >
              <Plus size={16} /> Add task
            </button>
          </div>
          {tasks === undefined || tasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks yet" description="Break this project down into tasks." />
          ) : (
            <div className="mt-2 flex flex-col divide-y divide-line px-4">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className="flex items-center gap-3 py-3 text-left"
                >
                  <span
                    className={
                      task.status === 'completed'
                        ? 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss'
                        : 'h-5 w-5 shrink-0 rounded-full border-2 border-line-strong'
                    }
                  />
                  <span
                    className={
                      task.status === 'completed'
                        ? 'flex-1 truncate text-sm text-ink-faint line-through'
                        : 'flex-1 truncate text-sm text-ink'
                    }
                  >
                    {task.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
