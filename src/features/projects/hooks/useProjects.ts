import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';

export function useProjects() {
  return useLiveQuery(
    () => db.projects.orderBy('updatedAt').reverse().toArray(),
    [],
    [],
  );
}

export function useActiveProjects() {
  return useLiveQuery(
    () =>
      db.projects
        .where('status')
        .anyOf(['active', 'planning', 'idea', 'on_hold'])
        .reverse()
        .sortBy('updatedAt'),
    [],
    [],
  );
}

export function useProject(id: string | undefined) {
  return useLiveQuery(() => (id ? db.projects.get(id) : undefined), [id]);
}
