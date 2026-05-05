import { CreateBoardButton } from '@/features/board-create';
import { BoardList } from '@/widgets/board-list';

export const BoardsPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-6">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your boards
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Open a board to manage its tasks.
        </p>
      </div>
      <CreateBoardButton />
    </header>
    <BoardList />
  </div>
);
