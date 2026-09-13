import { describe, it, expect, beforeEach } from 'vitest';
import { db, ensureSettings } from '../../src/db';
import { newId, nowIso } from '../../src/utils/id';
import type { Project, Task } from '../../src/types/entities';

async function clearAll() {
  await db.transaction(
    'rw',
    [db.projects, db.tasks, db.ideas, db.notes, db.research, db.milestones, db.goals, db.tags, db.activities, db.references, db.settings],
    async () => {
      await Promise.all([
        db.projects.clear(),
        db.tasks.clear(),
        db.ideas.clear(),
        db.notes.clear(),
        db.research.clear(),
        db.milestones.clear(),
        db.goals.clear(),
        db.tags.clear(),
        db.activities.clear(),
        db.references.clear(),
        db.settings.clear(),
      ]);
    },
  );
}

beforeEach(async () => {
  await clearAll();
});

describe('Dexie schema: projects', () => {
  it('creates, reads, updates, and deletes a project', async () => {
    const now = nowIso();
    const project: Project = {
      id: newId(),
      name: 'AstroTwin',
      status: 'active',
      priority: 'high',
      progress: 0,
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    await db.projects.add(project);
    const fetched = await db.projects.get(project.id);
    expect(fetched?.name).toBe('AstroTwin');

    await db.projects.update(project.id, { name: 'AstroTwin v2' });
    const updated = await db.projects.get(project.id);
    expect(updated?.name).toBe('AstroTwin v2');

    await db.projects.delete(project.id);
    expect(await db.projects.get(project.id)).toBeUndefined();
  });

  it('filters projects by status using the status index', async () => {
    const now = nowIso();
    await db.projects.bulkAdd([
      { id: newId(), name: 'A', status: 'active', priority: 'low', progress: 0, tags: [], createdAt: now, updatedAt: now },
      { id: newId(), name: 'B', status: 'archived', priority: 'low', progress: 0, tags: [], createdAt: now, updatedAt: now },
    ]);

    const active = await db.projects.where('status').equals('active').toArray();
    expect(active).toHaveLength(1);
    expect(active[0].name).toBe('A');
  });
});

describe('Dexie schema: tasks', () => {
  it('finds tasks by projectId via index', async () => {
    const now = nowIso();
    const projectId = newId();
    const task: Task = {
      id: newId(),
      title: 'Write report',
      status: 'todo',
      priority: 'medium',
      tags: [],
      order: 0,
      projectId,
      createdAt: now,
      updatedAt: now,
    };
    await db.tasks.add(task);

    const found = await db.tasks.where('projectId').equals(projectId).toArray();
    expect(found).toHaveLength(1);
    expect(found[0].title).toBe('Write report');
  });

  it('finds tasks by tag using the multi-entry tags index', async () => {
    const now = nowIso();
    const tagId = newId();
    await db.tasks.add({
      id: newId(),
      title: 'Tagged task',
      status: 'todo',
      priority: 'medium',
      tags: [tagId],
      order: 0,
      createdAt: now,
      updatedAt: now,
    });

    const found = await db.tasks.where('tags').equals(tagId).toArray();
    expect(found).toHaveLength(1);
  });
});

describe('ensureSettings', () => {
  it('creates a default settings row exactly once', async () => {
    const first = await ensureSettings();
    expect(first.theme).toBe('system');

    await db.settings.update('singleton', { theme: 'dark' });
    const second = await ensureSettings();
    expect(second.theme).toBe('dark');
  });
});
