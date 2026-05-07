import { useMemo } from 'react';
import { PRIORITIES, PRIORITY_LABEL, type Priority } from '@/entities/task';
import { NO_AUTHOR, USERS, type AuthorFilterValue } from '@/entities/user';
import type { BoardId } from '@/shared/config/ids';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { SearchIcon, XIcon } from '@/shared/ui/icon';
import { useBoardFilter } from '../lib/use-board-filter';
import { useBoardTagOptions } from '../lib/use-board-tag-options';
import {
  MultiSelectDropdown,
  type MultiSelectOption,
} from './multi-select-dropdown';

const PRIORITY_OPTIONS: MultiSelectOption<Priority>[] = PRIORITIES.map((p) => ({
  value: p,
  label: PRIORITY_LABEL[p],
}));

const AUTHOR_OPTIONS: MultiSelectOption<AuthorFilterValue>[] = [
  ...USERS.map((u) => ({ value: u.id, label: u.name })),
  { value: NO_AUTHOR, label: 'No author' },
];

const toggle = <T,>(values: readonly T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];

type BoardFilterBarProps = {
  boardId: BoardId;
};

export const BoardFilterBar = ({ boardId }: BoardFilterBarProps) => {
  const { filter, setFilter, clear, isActive } = useBoardFilter();
  const tagOptions = useBoardTagOptions(boardId);

  const tagItems = useMemo<MultiSelectOption<string>[]>(
    () => tagOptions.map((t) => ({ value: t, label: t })),
    [tagOptions]
  );

  return (
    <div
      role="search"
      aria-label="Filter tasks"
      className="mt-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/60 p-3 backdrop-blur dark:border-gray-700 dark:bg-gray-900/60"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            aria-hidden
          >
            <SearchIcon />
          </span>
          <Input
            type="search"
            placeholder="Search by title…"
            value={filter.q}
            onChange={(e) => setFilter({ q: e.target.value })}
            className="pl-9"
            aria-label="Search by title"
          />
        </div>

        <MultiSelectDropdown
          label="Author"
          options={AUTHOR_OPTIONS}
          selected={filter.authors}
          onToggle={(v) =>
            setFilter({ authors: toggle(filter.authors, v) })
          }
        />
        <MultiSelectDropdown
          label="Priority"
          options={PRIORITY_OPTIONS}
          selected={filter.priorities}
          onToggle={(v) =>
            setFilter({ priorities: toggle(filter.priorities, v) })
          }
        />
        <MultiSelectDropdown
          label="Tags"
          options={tagItems}
          selected={filter.tags}
          onToggle={(v) => setFilter({ tags: toggle(filter.tags, v) })}
          emptyLabel={tagItems.length === 0 ? 'No tags' : 'Any'}
          align="right"
        />

        {isActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            aria-label="Clear all filters"
          >
            <XIcon /> Clear
          </Button>
        )}
      </div>

      {isActive && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Drag &amp; drop is disabled while filters are active.
        </p>
      )}
    </div>
  );
};
