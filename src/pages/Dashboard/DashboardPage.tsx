import { Link } from 'react-router-dom';
import { CheckSquare, FolderKanban, Lightbulb, StickyNote, ArrowRight, Sparkles } from 'lucide-react';
import { greeting, dueSoonLabel, formatDate } from '../../utils/dates';
import { useActiveProjects } from '../../features/projects/hooks/useProjects';
import { useTaskView, useDashboardTaskStats } from '../../features/tasks/hooks/useTasks';
import { Card } from '../../components/ui/Card';
import { PriorityBadge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/feedback/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useUIStore } from '../../store/uiStore';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants/enums';
import { toggleTaskComplete } from '../../services/taskService';

export function DashboardPage() {
  const stats = useDashboardTaskStats();
  const projects = useActiveProjects();
  const todayTasks = useTaskView('today');
  const overdueTasks = useTaskView('overdue');
  const openQuickCapture = useUIStore((s) => s.openQuickCapture);

  const relevantTasks = [...(overdueTasks ?? []), ...(todayTasks ?? [])].slice(0, 5);

  return (
    <div className="flex flex-col gap-6 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+20px)]">
      <div>
        <p className="text-sm text-ink-soft">{formatDate(new Date().toISOString(), 'EEEE, MMM d')}</p>
        <h1 className="font-[var(--font-display)] text-[26px] leading-tight text-ink">{greeting()}.</h1>
      </div>

      {/* Stats strip */}
      {stats ? (
        <div className="grid grid-cols-4 gap-2.5">
          <StatTile label="Active" value={projects?.length ?? 0} />
          <StatTile label="Due today" value={stats.dueToday} tone={stats.dueToday > 0 ? 'accent' : undefined} />
          <StatTile label="Overdue" value={stats.overdue} tone={stats.overdue > 0 ? 'rust' : undefined} />
          <StatTile label="Done" value={stats.completed} tone="moss" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <QuickAction icon={FolderKanban} label="New project" onClick={() => openQuickCapture('project')} />
        <QuickAction icon={CheckSquare} label="New task" onClick={() => openQuickCapture('task')} />
        <QuickAction icon={Lightbulb} label="New idea" onClick={() => openQuickCapture('idea')} />
        <QuickAction icon={StickyNote} label="New note" onClick={() => openQuickCapture('note')} />
      </div>

      {/* Focus: today + overdue tasks */}
      <section>
        <SectionHeader title="Focus" viewAllTo="/tasks" />
        {relevantTasks.length === 0 ? (
          <div className="rounded-[var(--radius-md)] bg-surface-sunken px-4 py-6 text-center text-sm text-ink-soft">
            Nothing due today. Enjoy the clear runway.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-surface">
            {relevantTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTaskComplete(task.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span
                  className={
                    task.status === 'completed'
                      ? 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss'
                      : 'h-5 w-5 shrink-0 rounded-full border-2 border-line-strong'
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{task.title}</span>
                </span>
                {task.dueDate && (
                  <span className="shrink-0 text-xs text-ink-faint">{dueSoonLabel(task.dueDate)}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Active projects */}
      <section>
        <SectionHeader title="Active projects" viewAllTo="/projects" />
        {projects === undefined ? (
          <Skeleton className="h-24" />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No projects yet"
            description="Start by creating your first project."
            actionLabel="Create project"
            onAction={() => openQuickCapture('project')}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {projects.slice(0, 3).map((project) => (
              <Card key={project.id}>
                <Link to={`/projects/${project.id}`} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-ink">{project.name}</span>
                    <PriorityBadge priority={project.priority} label={PRIORITY_LABELS[project.priority]} />
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span>{STATUS_LABELS[project.status]}</span>
                    <span>{project.progress}%</span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ label, value, tone }: { label: string; value: number; tone?: 'accent' | 'rust' | 'moss' }) {
  const toneClass = tone === 'accent' ? 'text-accent' : tone === 'rust' ? 'text-rust' : tone === 'moss' ? 'text-moss' : 'text-ink';
  return (
    <div className="rounded-[var(--radius-md)] bg-surface border border-line px-2.5 py-3 text-center">
      <div className={`text-xl font-semibold ${toneClass}`}>{value}</div>
      <div className="text-[11px] text-ink-soft">{label}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: typeof CheckSquare; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium text-ink-soft"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function SectionHeader({ title, viewAllTo }: { title: string; viewAllTo: string }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      <Link to={viewAllTo} className="flex items-center gap-0.5 text-xs font-medium text-accent">
        View all <ArrowRight size={13} />
      </Link>
    </div>
  );
}
