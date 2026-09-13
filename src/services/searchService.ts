import { db } from '../db';
import type { EntityType } from '../constants/enums';

export interface SearchResult {
  id: string;
  type: EntityType;
  title: string;
  snippet?: string;
  updatedAt: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [projects, tasks, ideas, notes, research] = await Promise.all([
    db.projects.toArray(),
    db.tasks.toArray(),
    db.ideas.toArray(),
    db.notes.toArray(),
    db.research.toArray(),
  ]);

  const results: SearchResult[] = [
    ...projects
      .filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      .map((p) => ({ id: p.id, type: 'project' as const, title: p.name, snippet: p.description, updatedAt: p.updatedAt })),
    ...tasks
      .filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
      .map((t) => ({ id: t.id, type: 'task' as const, title: t.title, snippet: t.description, updatedAt: t.updatedAt })),
    ...ideas
      .filter((i) => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
      .map((i) => ({ id: i.id, type: 'idea' as const, title: i.title, snippet: i.description, updatedAt: i.updatedAt })),
    ...notes
      .filter((n) => n.title.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
      .map((n) => ({ id: n.id, type: 'note' as const, title: n.title, snippet: n.content, updatedAt: n.updatedAt })),
    ...research
      .filter((r) => r.title.toLowerCase().includes(q) || r.summary?.toLowerCase().includes(q))
      .map((r) => ({ id: r.id, type: 'research' as const, title: r.title, snippet: r.summary, updatedAt: r.updatedAt })),
  ];

  return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
