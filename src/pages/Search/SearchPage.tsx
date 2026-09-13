import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { globalSearch, type SearchResult } from '../../services/searchService';
import { useDebounce } from '../../hooks/useDebounce';

const typeLabel: Record<SearchResult['type'], string> = {
  project: 'Project',
  task: 'Task',
  idea: 'Idea',
  note: 'Note',
  research: 'Research',
  goal: 'Goal',
  milestone: 'Milestone',
  reference: 'Link',
};

const typeRoute: Partial<Record<SearchResult['type'], (id: string) => string>> = {
  project: (id) => `/projects/${id}`,
};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 250);
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    globalSearch(debounced).then((r) => {
      if (!cancelled) setResults(r);
    });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <div>
      <PageHeader title="Search" />
      <div className="px-4 pt-3">
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, tasks, ideas, notes, research…"
        />
      </div>

      {!debounced ? (
        <EmptyState icon={SearchIcon} title="Search everything" description="Find any project, task, idea, note, or research entry — all stored on this device." />
      ) : results.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No results" description={`Nothing matches "${debounced}".`} />
      ) : (
        <div className="flex flex-col divide-y divide-line px-4 pt-2">
          {results.map((r) => {
            const route = typeRoute[r.type]?.(r.id);
            const content = (
              <div className="py-3">
                <div className="mb-1 flex items-center gap-2">
                  <Badge>{typeLabel[r.type]}</Badge>
                </div>
                <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                {r.snippet && <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{r.snippet}</p>}
              </div>
            );
            return route ? (
              <button key={`${r.type}-${r.id}`} onClick={() => navigate(route)} className="text-left">
                {content}
              </button>
            ) : (
              <div key={`${r.type}-${r.id}`}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
