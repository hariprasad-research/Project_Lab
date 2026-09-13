import { db } from '../db';
import { newId, nowIso } from '../utils/id';
import { projectSchema } from '../schemas/entitySchemas';
import type { Project } from '../types/entities';
import { logActivity } from './activityService';

export type ProjectInput = {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  status: Project['status'];
  priority: Project['priority'];
  startDate?: string;
  targetDate?: string;
  tags?: string[];
};

export async function createProject(input: ProjectInput): Promise<Project> {
  const now = nowIso();
  const draft: Project = {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    progress: 0,
    tags: input.tags ?? [],
    ...input,
  };

  const parsed = projectSchema.parse(draft);
  await db.projects.add(parsed);
  await logActivity('created', 'project', parsed.id, parsed.name);
  return parsed;
}

export async function updateProject(id: string, patch: Partial<ProjectInput>): Promise<void> {
  const existing = await db.projects.get(id);
  if (!existing) throw new Error('Project not found');

  const updated = { ...existing, ...patch, updatedAt: nowIso() };
  const parsed = projectSchema.parse(updated);
  await db.projects.put(parsed);
  await logActivity('updated', 'project', parsed.id, parsed.name);
}

/** Soft-delete: archives rather than destroying, per the confirmed archive-first policy. */
export async function archiveProject(id: string): Promise<void> {
  const existing = await db.projects.get(id);
  if (!existing) return;
  await db.projects.update(id, { status: 'archived', archivedAt: nowIso(), updatedAt: nowIso() });
  await logActivity('archived', 'project', id, existing.name);
}

/**
 * Hard delete — only called after the caller has confirmed with the user and
 * shown linked-item counts. Orphans (does not cascade-delete) linked tasks,
 * notes, and milestones by clearing their projectId, so no user data is lost.
 */
export async function deleteProjectPermanently(id: string): Promise<void> {
  const existing = await db.projects.get(id);
  if (!existing) return;

  await db.transaction('rw', [db.projects, db.tasks, db.notes, db.milestones], async () => {
    const tasks = await db.tasks.where('projectId').equals(id).toArray();
    for (const t of tasks) await db.tasks.update(t.id, { projectId: undefined });

    const notes = await db.notes.where('projectId').equals(id).toArray();
    for (const n of notes) await db.notes.update(n.id, { projectId: undefined });

    await db.milestones.where('projectId').equals(id).delete();
    await db.projects.delete(id);
  });

  await logActivity('deleted', 'project', id, existing.name);
}

export async function countLinkedItems(projectId: string) {
  const [tasks, notes, milestones] = await Promise.all([
    db.tasks.where('projectId').equals(projectId).count(),
    db.notes.where('projectId').equals(projectId).count(),
    db.milestones.where('projectId').equals(projectId).count(),
  ]);
  return { tasks, notes, milestones };
}

/** Recomputes and persists progress from completed vs total tasks. */
export async function recalculateProjectProgress(projectId: string): Promise<number> {
  const tasks = await db.tasks.where('projectId').equals(projectId).toArray();
  const progress =
    tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100);
  await db.projects.update(projectId, { progress, updatedAt: nowIso() });
  return progress;
}
