import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/db';
import { createTask, toggleTaskComplete, deleteTask, duplicateTask } from '../../src/services/taskService';

beforeEach(async () => {
  await db.transaction('rw', [db.tasks, db.projects, db.activities], async () => {
    await db.tasks.clear();
    await db.projects.clear();
    await db.activities.clear();
  });
});

describe('taskService', () => {
  it('creates a task with an incrementing order within its project', async () => {
    const t1 = await createTask({ title: 'First', status: 'todo', priority: 'low' });
    const t2 = await createTask({ title: 'Second', status: 'todo', priority: 'low' });
    expect(t2.order).toBeGreaterThanOrEqual(t1.order);
  });

  it('toggles completion and sets/clears completedAt', async () => {
    const task = await createTask({ title: 'Toggle me', status: 'todo', priority: 'low' });
    await toggleTaskComplete(task.id);
    let updated = await db.tasks.get(task.id);
    expect(updated?.status).toBe('completed');
    expect(updated?.completedAt).toBeTruthy();

    await toggleTaskComplete(task.id);
    updated = await db.tasks.get(task.id);
    expect(updated?.status).toBe('todo');
    expect(updated?.completedAt).toBeUndefined();
  });

  it('deletes subtasks when the parent task is deleted', async () => {
    const parent = await createTask({ title: 'Parent', status: 'todo', priority: 'low' });
    const child = await createTask({ title: 'Child', status: 'todo', priority: 'low', parentTaskId: parent.id });

    await deleteTask(parent.id);

    expect(await db.tasks.get(parent.id)).toBeUndefined();
    expect(await db.tasks.get(child.id)).toBeUndefined();
  });

  it('duplicates a task as a fresh todo item', async () => {
    const original = await createTask({ title: 'Original', status: 'completed', priority: 'high' });
    const copy = await duplicateTask(original.id);

    expect(copy?.title).toBe('Original (copy)');
    expect(copy?.status).toBe('todo');
    expect(copy?.id).not.toBe(original.id);
  });
});
