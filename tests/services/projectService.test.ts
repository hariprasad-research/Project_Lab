import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/db';
import { createProject, updateProject, archiveProject, deleteProjectPermanently, countLinkedItems } from '../../src/services/projectService';
import { createTask, toggleTaskComplete } from '../../src/services/taskService';

beforeEach(async () => {
  await db.transaction('rw', [db.projects, db.tasks, db.activities], async () => {
    await db.projects.clear();
    await db.tasks.clear();
    await db.activities.clear();
  });
});

describe('projectService', () => {
  it('creates a project with validated defaults', async () => {
    const project = await createProject({ name: 'Hardware Rig', status: 'planning', priority: 'medium' });
    expect(project.id).toBeTruthy();
    expect(project.progress).toBe(0);
    expect(project.tags).toEqual([]);
  });

  it('rejects an invalid project (empty name)', async () => {
    await expect(createProject({ name: '', status: 'planning', priority: 'medium' })).rejects.toThrow();
  });

  it('updates a project and bumps updatedAt', async () => {
    const project = await createProject({ name: 'Original', status: 'idea', priority: 'low' });
    const before = project.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    await updateProject(project.id, { name: 'Renamed' });
    const updated = await db.projects.get(project.id);
    expect(updated?.name).toBe('Renamed');
    expect(updated!.updatedAt >= before).toBe(true);
  });

  it('archives instead of deleting on archiveProject', async () => {
    const project = await createProject({ name: 'To Archive', status: 'active', priority: 'low' });
    await archiveProject(project.id);
    const found = await db.projects.get(project.id);
    expect(found?.status).toBe('archived');
    expect(found?.archivedAt).toBeTruthy();
  });

  it('recalculates progress as tasks complete', async () => {
    const project = await createProject({ name: 'Progress Test', status: 'active', priority: 'low' });
    const t1 = await createTask({ title: 'Task 1', status: 'todo', priority: 'low', projectId: project.id });
    await createTask({ title: 'Task 2', status: 'todo', priority: 'low', projectId: project.id });

    await toggleTaskComplete(t1.id);

    const updatedProject = await db.projects.get(project.id);
    expect(updatedProject?.progress).toBe(50);
  });

  it('orphans linked tasks (does not delete them) on permanent project delete', async () => {
    const project = await createProject({ name: 'Doomed Project', status: 'active', priority: 'low' });
    const task = await createTask({ title: 'Survives', status: 'todo', priority: 'low', projectId: project.id });

    const counts = await countLinkedItems(project.id);
    expect(counts.tasks).toBe(1);

    await deleteProjectPermanently(project.id);

    expect(await db.projects.get(project.id)).toBeUndefined();
    const survivingTask = await db.tasks.get(task.id);
    expect(survivingTask).toBeDefined();
    expect(survivingTask?.projectId).toBeUndefined();
  });
});
