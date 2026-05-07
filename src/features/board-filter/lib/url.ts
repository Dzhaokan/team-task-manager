import { PRIORITIES, type Priority } from '@/entities/task';
import { NO_AUTHOR, USERS, type AuthorFilterValue } from '@/entities/user';
import { EMPTY_FILTER, type BoardFilter } from '../model/types';

const PARAM_KEYS = ['q', 'priority', 'tag', 'author'] as const;

const PRIORITY_SET: ReadonlySet<string> = new Set<Priority>(PRIORITIES);
const AUTHOR_SET: ReadonlySet<string> = new Set<AuthorFilterValue>([
  ...USERS.map((u) => u.id),
  NO_AUTHOR,
]);

const isPriority = (value: string): value is Priority =>
  PRIORITY_SET.has(value);

const isAuthor = (value: string): value is AuthorFilterValue =>
  AUTHOR_SET.has(value);

const dedupe = <T>(values: T[]): T[] => Array.from(new Set(values));

export const parseFilterFromParams = (params: URLSearchParams): BoardFilter => {
  const q = params.get('q')?.trim() ?? '';
  const priorities = dedupe(params.getAll('priority').filter(isPriority));
  const tags = dedupe(
    params
      .getAll('tag')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
  );
  const authors = dedupe(params.getAll('author').filter(isAuthor));
  return { q, priorities, tags, authors };
};

export const writeFilterToParams = (
  base: URLSearchParams,
  filter: BoardFilter
): URLSearchParams => {
  const next = new URLSearchParams(base);
  for (const key of PARAM_KEYS) next.delete(key);

  if (filter.q.trim()) next.set('q', filter.q.trim());
  for (const p of filter.priorities) next.append('priority', p);
  for (const t of filter.tags) next.append('tag', t);
  for (const a of filter.authors) next.append('author', a);

  return next;
};

export const stripFilterFromParams = (
  base: URLSearchParams
): URLSearchParams => writeFilterToParams(base, EMPTY_FILTER);
