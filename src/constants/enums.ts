// Centralized enum-like constants. UI labels/colors map from these — never
// hardcode a status/priority string or its color anywhere else.

export const PROJECT_STATUSES = [
  'idea',
  'planning',
  'active',
  'on_hold',
  'completed',
  'archived',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = [
  'todo',
  'in_progress',
  'blocked',
  'completed',
  'cancelled',
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const IDEA_STATUSES = [
  'raw',
  'exploring',
  'validating',
  'planned',
  'converted',
  'archived',
] as const;
export type IdeaStatus = (typeof IDEA_STATUSES)[number];

export const IDEA_CATEGORIES = [
  'startup',
  'research',
  'hardware',
  'software',
  'product',
  'hackathon',
  'education',
  'creative',
  'other',
] as const;
export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

export const RESEARCH_STATUSES = [
  'idea',
  'literature_review',
  'experiment',
  'analysis',
  'completed',
  'archived',
] as const;
export type ResearchStatus = (typeof RESEARCH_STATUSES)[number];

export const MILESTONE_STATUSES = [
  'upcoming',
  'active',
  'completed',
  'delayed',
] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const GOAL_STATUSES = [
  'not_started',
  'active',
  'completed',
  'paused',
] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const ENTITY_TYPES = [
  'project',
  'task',
  'idea',
  'note',
  'research',
  'goal',
  'milestone',
  'reference',
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ACTIVITY_ACTIONS = [
  'created',
  'updated',
  'completed',
  'reopened',
  'archived',
  'deleted',
  'converted',
] as const;
export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export const THEME_MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

// Display metadata kept alongside the enums so components never hardcode copy.
export const STATUS_LABELS: Record<string, string> = {
  idea: 'Idea',
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On hold',
  completed: 'Completed',
  archived: 'Archived',
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  cancelled: 'Cancelled',
  raw: 'Raw',
  exploring: 'Exploring',
  validating: 'Validating',
  planned: 'Planned',
  converted: 'Converted',
  literature_review: 'Literature review',
  experiment: 'Experiment',
  analysis: 'Analysis',
  upcoming: 'Upcoming',
  delayed: 'Delayed',
  not_started: 'Not started',
  paused: 'Paused',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};
