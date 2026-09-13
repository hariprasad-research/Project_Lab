import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/db';
import { createProject } from '../../src/services/projectService';
import { exportBackup, validateBackupFile, restoreBackup, clearAllData } from '../../src/services/backupService';

beforeEach(async () => {
  await clearAllData();
});

describe('backupService', () => {
  it('exports current data into a valid backup shape', async () => {
    await createProject({ name: 'Exportable', status: 'active', priority: 'low' });
    const backup = await exportBackup();

    expect(backup.data.projects).toHaveLength(1);
    const validation = validateBackupFile(backup);
    expect(validation.valid).toBe(true);
  });

  it('rejects malformed JSON structures', () => {
    const result = validateBackupFile({ not: 'a backup' });
    expect(result.valid).toBe(false);
  });

  it('rejects a backup from a newer, unsupported schema version', () => {
    const result = validateBackupFile({
      schemaVersion: 999,
      exportedAt: new Date().toISOString(),
      data: { projects: [], tasks: [], ideas: [], notes: [], research: [], milestones: [], goals: [], tags: [], activities: [], references: [] },
    });
    expect(result.valid).toBe(false);
  });

  it('replace mode wipes existing data and installs the backup', async () => {
    await createProject({ name: 'Will be replaced', status: 'active', priority: 'low' });
    const backup = await exportBackup(); // snapshot with 1 project

    await clearAllData();
    await createProject({ name: 'Unrelated new project', status: 'active', priority: 'low' });

    await restoreBackup(backup, 'replace');

    const projects = await db.projects.toArray();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Will be replaced');
  });

  it('merge mode keeps the newest version of a record and does not duplicate on re-import', async () => {
    const project = await createProject({ name: 'v1', status: 'active', priority: 'low' });
    const backup = await exportBackup();

    // Simulate an edit made after the backup was taken.
    await new Promise((r) => setTimeout(r, 5));
    await db.projects.update(project.id, { name: 'v2', updatedAt: new Date().toISOString() });

    await restoreBackup(backup, 'merge');

    const found = await db.projects.get(project.id);
    expect(found?.name).toBe('v2'); // newer local edit must survive the merge
    expect(await db.projects.count()).toBe(1); // no duplicate row
  });
});
