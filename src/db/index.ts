import Dexie, { type EntityTable } from 'dexie';
import type {
  Project,
  Task,
  Idea,
  Note,
  ResearchEntry,
  Milestone,
  Goal,
  Tag,
  Activity,
  Reference,
  AppSettings,
} from '../types/entities';

/**
 * Single Dexie database for PocketLab.
 *
 * Versioning discipline: every future schema change adds a NEW
 * `.version(n)` block with an explicit `.upgrade()` function rather than
 * mutating this one — this is the migration path that lets us evolve the
 * schema later (new fields, new stores) without wiping local user data.
 */
export class PocketLabDB extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  ideas!: EntityTable<Idea, 'id'>;
  notes!: EntityTable<Note, 'id'>;
  research!: EntityTable<ResearchEntry, 'id'>;
  milestones!: EntityTable<Milestone, 'id'>;
  goals!: EntityTable<Goal, 'id'>;
  tags!: EntityTable<Tag, 'id'>;
  activities!: EntityTable<Activity, 'id'>;
  references!: EntityTable<Reference, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('pocketlab-db');

    this.version(1).stores({
      // Multi-entry index on `tags` (the `*` prefix) enables fast
      // "find all records with tag X" queries used by tag filtering (Section 16).
      projects: 'id, status, priority, category, *tags, targetDate, updatedAt',
      tasks: 'id, status, priority, projectId, parentTaskId, dueDate, *tags, updatedAt',
      ideas: 'id, status, category, priority, relatedProjectId, *tags, updatedAt',
      notes: 'id, projectId, researchId, ideaId, isPinned, isArchived, *tags, updatedAt',
      research: 'id, status, projectId, *tags, updatedAt',
      milestones: 'id, projectId, status, dueDate',
      goals: 'id, status, targetDate',
      tags: 'id, &name',
      activities: 'id, entityType, entityId, timestamp',
      references: 'id, linkedEntityType, linkedEntityId, category',
      settings: 'id',
    });

    // v2: index `order` on tasks — required by the `orderBy('order')` query
    // in useTasks.ts, which throws a SchemaError without it.
    this.version(2).stores({
      tasks: 'id, status, priority, projectId, parentTaskId, dueDate, *tags, updatedAt, order',
    });
  }
}

export const db = new PocketLabDB();

/** Ensures the singleton settings row exists; called once at app boot. */
export async function ensureSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('singleton');
  if (existing) return existing;

  const defaults: AppSettings = {
    id: 'singleton',
    theme: 'system',
    defaultTaskPriority: 'medium',
    defaultProjectView: 'overview',
    notificationsEnabled: true,
    hasSeenOnboarding: false,
    hasDemoData: false,
  };
  await db.settings.put(defaults);
  return defaults;
}
