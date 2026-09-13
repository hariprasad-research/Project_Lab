import { db } from '../db';
import { backupSchema, type BackupFile } from '../schemas/entitySchemas';

const SCHEMA_VERSION = 1;

export async function exportBackup(): Promise<BackupFile> {
  const [projects, tasks, ideas, notes, research, milestones, goals, tags, activities, references] =
    await Promise.all([
      db.projects.toArray(),
      db.tasks.toArray(),
      db.ideas.toArray(),
      db.notes.toArray(),
      db.research.toArray(),
      db.milestones.toArray(),
      db.goals.toArray(),
      db.tags.toArray(),
      db.activities.toArray(),
      db.references.toArray(),
    ]);

  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: { projects, tasks, ideas, notes, research, milestones, goals, tags, activities, references },
  };
}

export function downloadBackup(backup: BackupFile) {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PocketLab_Backup_${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export interface ImportValidation {
  valid: boolean;
  error?: string;
  counts?: Record<string, number>;
  parsed?: BackupFile;
}

/** Validates an uploaded file before anything touches the database. */
export function validateBackupFile(raw: unknown): ImportValidation {
  const result = backupSchema.safeParse(raw);
  if (!result.success) {
    return { valid: false, error: 'This file is not a valid PocketLab backup.' };
  }
  if (result.data.schemaVersion > SCHEMA_VERSION) {
    return { valid: false, error: 'This backup was made with a newer version of PocketLab.' };
  }

  const counts = Object.fromEntries(
    Object.entries(result.data.data).map(([key, arr]) => [key, (arr as unknown[]).length]),
  );
  return { valid: true, counts, parsed: result.data };
}

/**
 * REPLACE: wipes all current data and writes the backup's data in.
 * MERGE: newest `updatedAt` wins per record id, nothing else is touched.
 */
export async function restoreBackup(backup: BackupFile, mode: 'replace' | 'merge'): Promise<void> {
  const stores = [
    db.projects, db.tasks, db.ideas, db.notes, db.research,
    db.milestones, db.goals, db.tags, db.activities, db.references,
  ];

  await db.transaction('rw', stores, async () => {
    if (mode === 'replace') {
      for (const store of stores) await store.clear();
      await db.projects.bulkAdd(backup.data.projects);
      await db.tasks.bulkAdd(backup.data.tasks);
      await db.ideas.bulkAdd(backup.data.ideas);
      await db.notes.bulkAdd(backup.data.notes);
      await db.research.bulkAdd(backup.data.research);
      await db.milestones.bulkAdd(backup.data.milestones);
      await db.goals.bulkAdd(backup.data.goals);
      await db.tags.bulkAdd(backup.data.tags);
      await db.activities.bulkAdd(backup.data.activities);
      await db.references.bulkAdd(backup.data.references);
      return;
    }

    // Merge: newest updatedAt wins per id; tags/activities/references have no
    // updatedAt, so merge is additive-by-id for those (put is idempotent).
    await mergeByUpdatedAt(db.projects, backup.data.projects);
    await mergeByUpdatedAt(db.tasks, backup.data.tasks);
    await mergeByUpdatedAt(db.ideas, backup.data.ideas);
    await mergeByUpdatedAt(db.notes, backup.data.notes);
    await mergeByUpdatedAt(db.research, backup.data.research);
    await mergeByUpdatedAt(db.milestones, backup.data.milestones);
    await mergeByUpdatedAt(db.goals, backup.data.goals);
    await db.tags.bulkPut(backup.data.tags);
    await db.activities.bulkPut(backup.data.activities);
    await db.references.bulkPut(backup.data.references);
  });
}

async function mergeByUpdatedAt(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: { get: (id: string) => Promise<{ updatedAt: string } | undefined>; put: (item: any) => Promise<unknown> },
  incoming: Array<{ id: string; updatedAt: string }>,
): Promise<void> {
  for (const record of incoming) {
    const existing = await table.get(record.id);
    if (!existing || existing.updatedAt < record.updatedAt) {
      await table.put(record);
    }
  }
}

export async function clearAllData(): Promise<void> {
  const stores = [
    db.projects, db.tasks, db.ideas, db.notes, db.research,
    db.milestones, db.goals, db.tags, db.activities, db.references,
  ];
  await db.transaction('rw', stores, async () => {
    for (const store of stores) await store.clear();
  });
}
