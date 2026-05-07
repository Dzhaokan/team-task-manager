import type { Priority } from '@/entities/task';
import type { AuthorFilterValue } from '@/entities/user';

export type BoardFilter = {
  q: string;
  priorities: Priority[];
  tags: string[];
  authors: AuthorFilterValue[];
};

export const EMPTY_FILTER: BoardFilter = {
  q: '',
  priorities: [],
  tags: [],
  authors: [],
};

export const isFilterActive = (filter: BoardFilter): boolean =>
  filter.q.length > 0 ||
  filter.priorities.length > 0 ||
  filter.tags.length > 0 ||
  filter.authors.length > 0;
