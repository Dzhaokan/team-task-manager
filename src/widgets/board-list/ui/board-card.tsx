import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Board } from '@/entities/board';
import { useBoardStore, selectBoardTaskCount } from '@/app/store/boardStore';
import { Card } from '@/shared/ui/card';
import { Menu } from '@/shared/ui/menu';
import { MoreHorizontalIcon } from '@/shared/ui/icon';
import { ROUTES } from '@/app/router';

type BoardCardProps = {
  board: Board;
  onRename: (board: Board) => void;
  onDelete: (board: Board) => void;
};

export const BoardCard = ({ board, onRename, onDelete }: BoardCardProps) => {
  const taskCountSelector = useMemo(
    () => selectBoardTaskCount(board.id),
    [board.id]
  );
  const taskCount = useBoardStore(taskCountSelector);

  return (
    <Card className="relative flex flex-col gap-2 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={ROUTES.board(board.id)}
          className="min-w-0 flex-1 truncate text-base font-semibold text-gray-900 hover:text-purple-600 focus:outline-none focus-visible:underline dark:text-gray-100 dark:hover:text-purple-400"
        >
          {board.name}
        </Link>
        <Menu
          trigger={(triggerProps) => (
            <button
              type="button"
              aria-label="Board options"
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              {...triggerProps}
            >
              <MoreHorizontalIcon />
            </button>
          )}
          items={[
            { label: 'Rename', onSelect: () => onRename(board) },
            {
              label: 'Delete',
              variant: 'danger',
              onSelect: () => onDelete(board),
            },
          ]}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
      </p>
    </Card>
  );
};
