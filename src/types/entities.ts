import type {
  ProjectStatus,
  TaskStatus,
  Priority,
  IdeaStatus,
  IdeaCategory,
  ResearchStatus,
  MilestoneStatus,
  GoalStatus,
  EntityType,
  ActivityAction,
} from '../constants/enums';

// Every persisted record shares these.
export interface BaseRecord {
  id: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  isDemo?: boolean;
}

export interface Project extends BaseRecord {
  name: string;
  description?: string;
  icon?: string; // lucide icon name
  category?: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  targetDate?: string;
  progress: number; // 0-100, derived + cached
  tags: string[]; // tag ids
  originIdeaId?: string;
  archivedAt?: string;
}

export interface Task extends BaseRecord {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  startDate?: string;
  projectId?: string;
  parentTaskId?: string; // subtasks self-reference
  tags: string[];
  order: number;
  completedAt?: string;
}

export interface Idea extends BaseRecord {
  title: string;
  description?: string;
  category: IdeaCategory;
  tags: string[];
  priority: Priority;
  status: IdeaStatus;
  potential?: string;
  relatedProjectId?: string;
  convertedToProjectId?: string;
}

export interface Note extends BaseRecord {
  title: string;
  content: string; // markdown-lite
  tags: string[];
  category?: string;
  projectId?: string;
  researchId?: string;
  ideaId?: string;
  isPinned: boolean;
  isArchived: boolean;
}

export interface ResearchEntry extends BaseRecord {
  title: string;
  researchQuestion?: string;
  objective?: string;
  hypothesis?: string;
  summary?: string;
  method?: string;
  observations?: string;
  results?: string;
  conclusion?: string;
  referenceIds: string[];
  links: string[];
  tags: string[];
  projectId?: string;
  status: ResearchStatus;
}

export interface Milestone extends BaseRecord {
  projectId: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: MilestoneStatus;
  progress: number;
  relatedTaskIds: string[];
}

export interface Goal extends BaseRecord {
  name: string;
  description?: string;
  category?: string;
  targetDate?: string;
  progress: number;
  status: GoalStatus;
  relatedProjectIds: string[];
  milestoneIds: string[];
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  entityLabel: string;
  timestamp: string;
}

export interface Reference {
  id: string;
  url: string;
  title: string;
  description?: string;
  category?: string;
  linkedEntityType?: EntityType;
  linkedEntityId?: string;
  createdAt: string;
}

export interface AppSettings {
  id: 'singleton';
  theme: 'light' | 'dark' | 'system';
  defaultTaskPriority: Priority;
  defaultProjectView: 'overview' | 'tasks' | 'notes';
  notificationsEnabled: boolean;
  hasSeenOnboarding: boolean;
  hasDemoData: boolean;
}
