import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';
import { isOverdue, isDueToday } from '../../../utils/dates';

export function useAllTasks() {
  return useLiveQuery(() => db.tasks.orderBy('order').toArray(), [], []);
}

export function useTasksByProject(projectId: string | undefined) {
  return useLiveQuery(
    () => (projectId ? db.tasks.where('projectId').equals(projectId).sortBy('order') : []),
    [projectId],
    [],
  );
}

export function useSubtasks(parentTaskId: string | undefined) {
  return useLiveQuery(
    () => (parentTaskId ? db.tasks.where('parentTaskId').equals(parentTaskId).sortBy('order') : []),
    [parentTaskId],
    [],
  );
}

export type TaskView = 'today' | 'upcoming' | 'overdue' | 'completed' | 'all';

export function useTaskView(view: TaskView) {
  const all = useAllTasks();

  if (!all) return undefined;

  switch (view) {
    case 'today':
      return all.filter((t) => t.status !== 'completed' && isDueToday(t.dueDate));
    case 'overdue':
      return all.filter((t) => t.status !== 'completed' && isOverdue(t.dueDate, t.completedAt));
    case 'upcoming':
      return all.filter(
        (t) => t.status !== 'completed' && t.dueDate && !isDueToday(t.dueDate) && !isOverdue(t.dueDate),
      );
    case 'completed':
      return all.filter((t) => t.status === 'completed');
    case 'all':
    default:
      return all.filter((t) => !t.parentTaskId); // top-level only; subtasks shown nested
  }
}

export function useDashboardTaskStats() {
  const all = useAllTasks();
  if (!all) return undefined;

  return {
    total: all.length,
    completed: all.filter((t) => t.status === 'completed').length,
    pending: all.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length,
    overdue: all.filter((t) => t.status !== 'completed' && isOverdue(t.dueDate, t.completedAt)).length,
    dueToday: all.filter((t) => t.status !== 'completed' && isDueToday(t.dueDate)).length,
  };
}
