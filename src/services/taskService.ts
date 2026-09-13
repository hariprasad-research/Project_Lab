import { db } from '../db';
import { newId, nowIso } from '../utils/id';
import { taskSchema } from '../schemas/entitySchemas';
import type { Task } from '../types/entities';
import { logActivity } from './activityService';
import { recalculateProjectProgress } from './projectService';

export type TaskInput = {
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate?: string;
  startDate?: string;
  projectId?: string;
  parentTaskId?: string;
  tags?: string[];
};

export async function createTask(input: TaskInput): Promise<Task> {
  const now = nowIso();
  const siblingCount = await db.tasks
    .where('projectId')
    .equals(input.projectId ?? '')
    .count();

  const draft: Task = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    tags: input.tags ?? [],
    order: siblingCount,
    ...input,
  };

  const parsed = taskSchema.parse(draft);
  await db.tasks.add(parsed);
  await logActivity('created', 'task', parsed.id, parsed.title);
  if (parsed.projectId) await recalculateProjectProgress(parsed.projectId);
  return parsed;
}

export async function updateTask(id: string, patch: Partial<TaskInput>): Promise<void> {
  const existing = await db.tasks.get(id);
  if (!existing) throw new Error('Task not found');

  const updated = { ...existing, ...patch, updatedAt: nowIso() };
  const parsed = taskSchema.parse(updated);
  await db.tasks.put(parsed);
  await logActivity('updated', 'task', parsed.id, parsed.title);
  if (parsed.projectId) await recalculateProjectProgress(parsed.projectId);
}

export async function toggleTaskComplete(id: string): Promise<void> {
  const existing = await db.tasks.get(id);
  if (!existing) return;

  const isCompleting = existing.status !== 'completed';
  await db.tasks.update(id, {
    status: isCompleting ? 'completed' : 'todo',
    completedAt: isCompleting ? nowIso() : undefined,
    updatedAt: nowIso(),
  });
  await logActivity(isCompleting ? 'completed' : 'reopened', 'task', id, existing.title);
  if (existing.projectId) await recalculateProjectProgress(existing.projectId);
}

export async function deleteTask(id: string): Promise<void> {
  const existing = await db.tasks.get(id);
  if (!existing) return;

  await db.transaction('rw', [db.tasks], async () => {
    // Subtasks are deleted with the parent — they have no independent meaning.
    await db.tasks.where('parentTaskId').equals(id).delete();
    await db.tasks.delete(id);
  });

  await logActivity('deleted', 'task', id, existing.title);
  if (existing.projectId) await recalculateProjectProgress(existing.projectId);
}

export async function duplicateTask(id: string): Promise<Task | null> {
  const existing = await db.tasks.get(id);
  if (!existing) return null;
  return createTask({
    title: `${existing.title} (copy)`,
    description: existing.description,
    status: 'todo',
    priority: existing.priority,
    dueDate: existing.dueDate,
    projectId: existing.projectId,
    tags: existing.tags,
  });
}
