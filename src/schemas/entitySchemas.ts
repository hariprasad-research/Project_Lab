import { z } from 'zod';
import {
  PROJECT_STATUSES,
  TASK_STATUSES,
  PRIORITIES,
  IDEA_STATUSES,
  IDEA_CATEGORIES,
  RESEARCH_STATUSES,
  MILESTONE_STATUSES,
  GOAL_STATUSES,
  ACTIVITY_ACTIONS,
  ENTITY_TYPES,
} from '../constants/enums';

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
  message: 'Invalid date',
});

const baseFields = {
  id: z.string().min(1),
  createdAt: isoDate,
  updatedAt: isoDate,
  isDemo: z.boolean().optional(),
};

export const projectSchema = z.object({
  ...baseFields,
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(5000).optional(),
  icon: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  status: z.enum(PROJECT_STATUSES),
  priority: z.enum(PRIORITIES),
  startDate: isoDate.optional(),
  targetDate: isoDate.optional(),
  progress: z.number().min(0).max(100),
  tags: z.array(z.string()).default([]),
  originIdeaId: z.string().optional(),
  archivedAt: isoDate.optional(),
});

export const taskSchema = z.object({
  ...baseFields,
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().max(5000).optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(PRIORITIES),
  dueDate: isoDate.optional(),
  startDate: isoDate.optional(),
  projectId: z.string().optional(),
  parentTaskId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  order: z.number().default(0),
  completedAt: isoDate.optional(),
});

export const ideaSchema = z.object({
  ...baseFields,
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().max(5000).optional(),
  category: z.enum(IDEA_CATEGORIES),
  tags: z.array(z.string()).default([]),
  priority: z.enum(PRIORITIES),
  status: z.enum(IDEA_STATUSES),
  potential: z.string().max(2000).optional(),
  relatedProjectId: z.string().optional(),
  convertedToProjectId: z.string().optional(),
});

export const noteSchema = z.object({
  ...baseFields,
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().max(100_000).default(''),
  tags: z.array(z.string()).default([]),
  category: z.string().max(100).optional(),
  projectId: z.string().optional(),
  researchId: z.string().optional(),
  ideaId: z.string().optional(),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export const researchSchema = z.object({
  ...baseFields,
  title: z.string().min(1, 'Title is required').max(300),
  researchQuestion: z.string().max(2000).optional(),
  objective: z.string().max(2000).optional(),
  hypothesis: z.string().max(2000).optional(),
  summary: z.string().max(10_000).optional(),
  method: z.string().max(10_000).optional(),
  observations: z.string().max(10_000).optional(),
  results: z.string().max(10_000).optional(),
  conclusion: z.string().max(10_000).optional(),
  referenceIds: z.array(z.string()).default([]),
  links: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  status: z.enum(RESEARCH_STATUSES),
});

export const milestoneSchema = z.object({
  ...baseFields,
  projectId: z.string().min(1),
  name: z.string().min(1, 'Name is required').max(300),
  description: z.string().max(2000).optional(),
  dueDate: isoDate.optional(),
  status: z.enum(MILESTONE_STATUSES),
  progress: z.number().min(0).max(100).default(0),
  relatedTaskIds: z.array(z.string()).default([]),
});

export const goalSchema = z.object({
  ...baseFields,
  name: z.string().min(1, 'Name is required').max(300),
  description: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  targetDate: isoDate.optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(GOAL_STATUSES),
  relatedProjectIds: z.array(z.string()).default([]),
  milestoneIds: z.array(z.string()).default([]),
});

export const tagSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  color: z.string().max(20).optional(),
  createdAt: isoDate,
});

export const activitySchema = z.object({
  id: z.string().min(1),
  action: z.enum(ACTIVITY_ACTIONS),
  entityType: z.enum(ENTITY_TYPES),
  entityId: z.string(),
  entityLabel: z.string(),
  timestamp: isoDate,
});

export const referenceSchema = z.object({
  id: z.string().min(1),
  url: z.string().url('Must be a valid URL'),
  title: z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  linkedEntityType: z.enum(ENTITY_TYPES).optional(),
  linkedEntityId: z.string().optional(),
  createdAt: isoDate,
});

export const settingsSchema = z.object({
  id: z.literal('singleton'),
  theme: z.enum(['light', 'dark', 'system']),
  defaultTaskPriority: z.enum(PRIORITIES),
  defaultProjectView: z.enum(['overview', 'tasks', 'notes']),
  notificationsEnabled: z.boolean(),
  hasSeenOnboarding: z.boolean(),
  hasDemoData: z.boolean(),
});

// Full backup file shape — validated on import before anything touches Dexie.
export const backupSchema = z.object({
  schemaVersion: z.number(),
  exportedAt: isoDate,
  data: z.object({
    projects: z.array(projectSchema),
    tasks: z.array(taskSchema),
    ideas: z.array(ideaSchema),
    notes: z.array(noteSchema),
    research: z.array(researchSchema),
    milestones: z.array(milestoneSchema),
    goals: z.array(goalSchema),
    tags: z.array(tagSchema),
    activities: z.array(activitySchema),
    references: z.array(referenceSchema),
  }),
});

export type BackupFile = z.infer<typeof backupSchema>;
