import { db } from '../db';
import { newId, nowIso } from '../utils/id';
import type { Tag } from '../types/entities';

/** Finds an existing tag by case-insensitive name, or creates one. Prevents duplicate tags (Section 16). */
export async function getOrCreateTag(name: string): Promise<Tag> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Tag name cannot be empty');

  const all = await db.tags.toArray();
  const existing = all.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;

  const tag: Tag = { id: newId(), name: trimmed, createdAt: nowIso() };
  await db.tags.add(tag);
  return tag;
}

export async function listTags(): Promise<Tag[]> {
  return db.tags.orderBy('name').toArray();
}

export async function renameTag(id: string, name: string): Promise<void> {
  await db.tags.update(id, { name: name.trim() });
}

export async function deleteTag(id: string): Promise<void> {
  // Untag from every entity type before deleting the tag itself, so no
  // records are left referencing a tag id that no longer exists.
  await db.transaction(
    'rw',
    [db.tags, db.projects, db.tasks, db.ideas, db.notes, db.research],
    async () => {
      const stores = [db.projects, db.tasks, db.ideas, db.notes, db.research] as const;
      for (const store of stores) {
        const affected = await store.where('tags').equals(id).toArray();
        for (const record of affected) {
          await store.update(record.id, {
            tags: record.tags.filter((t: string) => t !== id),
          } as never);
        }
      }
      await db.tags.delete(id);
    },
  );
}
