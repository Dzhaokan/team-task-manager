import type { Task } from '@/entities/task';
import { NO_AUTHOR } from '@/entities/user';
import type { BoardFilter } from '../model/types';

export const matchesFilter = (task: Task, filter: BoardFilter): boolean => {
  const q = filter.q.trim().toLowerCase();
  if (q && !task.title.toLowerCase().includes(q)) return false;

  if (
    filter.priorities.length > 0 &&
    !filter.priorities.includes(task.priority)
  ) {
    return false;
  }

  if (
    filter.tags.length > 0 &&
    !filter.tags.some((tag) => task.tags.includes(tag))
  ) {
    return false;
  }

  if (filter.authors.length > 0) {
    const matchAuthor =
      task.assigneeId === null
        ? filter.authors.includes(NO_AUTHOR)
        : filter.authors.includes(task.assigneeId);
    if (!matchAuthor) return false;
  }

  return true;
};
