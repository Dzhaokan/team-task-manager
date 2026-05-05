import { useState } from 'react';
import type { Board } from '@/entities/board';
import { useBoards } from '@/features/board-list';
import { RenameBoardModal } from '@/features/board-rename';
import { DeleteBoardModal } from '@/features/board-delete';
import { BoardCard } from './board-card';

const SkeletonCard = () => (
  <div className="h-20 animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800" />
);

export const BoardList = () => {
  const { data, isPending, isError, error, refetch } = useBoards();
  const [renameTarget, setRenameTarget] = useState<Board | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Board | null>(null);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
        <p className="font-medium">Could not load boards.</p>
        <p className="mt-1 opacity-80">
          {error instanceof Error ? error.message : 'Unexpected error'}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-2 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No boards yet. Create your first one.
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((board) => (
          <li key={board.id}>
            <BoardCard
              board={board}
              onRename={setRenameTarget}
              onDelete={setDeleteTarget}
            />
          </li>
        ))}
      </ul>
      {renameTarget && (
        <RenameBoardModal
          board={renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteBoardModal
          board={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};
