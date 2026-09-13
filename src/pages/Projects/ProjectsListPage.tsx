import { Link } from 'react-router-dom';
import { FolderKanban, Plus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { PriorityBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ListSkeleton } from '../../components/feedback/Skeleton';
import { useProjects } from '../../features/projects/hooks/useProjects';
import { useUIStore } from '../../store/uiStore';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants/enums';

export function ProjectsListPage() {
  const projects = useProjects();
  const openQuickCapture = useUIStore((s) => s.openQuickCapture);

  return (
    <div>
      <PageHeader
        title="Projects"
        action={
          <button
            onClick={() => openQuickCapture('project')}
            aria-label="New project"
            className="rounded-full bg-accent-soft p-2 text-accent-strong"
          >
            <Plus size={20} />
          </button>
        }
      />

      {projects === undefined ? (
        <ListSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Start by creating your first project."
          actionLabel="Create project"
          onAction={() => openQuickCapture('project')}
        />
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-ink">{project.name}</span>
                  <PriorityBadge priority={project.priority} label={PRIORITY_LABELS[project.priority]} />
                </div>
                {project.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{project.description}</p>
                )}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
                  <span>{STATUS_LABELS[project.status]}</span>
                  <span>{project.progress}%</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
