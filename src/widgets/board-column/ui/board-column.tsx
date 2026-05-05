import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useShallow } from 'zustand/react/shallow';
import { TaskCard } from '@/entities/task';
import { selectColumnTasks, useBoardStore } from '@/app/store/boardStore';
import type { ColumnId } from '@/shared/config/columns';
import type { BoardId } from '@/shared/config/ids';

type BoardColumnProps = {
  boardId: BoardId;
  columnId: ColumnId;
  title: string;
};

export const BoardColumn = ({
  boardId,
  columnId,
  title,
}: BoardColumnProps) => {
  const tasksSelector = useMemo(
    () => selectColumnTasks(boardId, columnId),
    [boardId, columnId]
  );
  const tasks = useBoardStore(useShallow(tasksSelector));
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const droppableData = useMemo(
    () => ({ type: 'column', columnId }),
    [columnId]
  );
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: droppableData,
  });

  return (
    <section className="flex w-full min-w-0 flex-col rounded-2xl bg-gray-100 p-3 md:w-80 dark:bg-gray-900">
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
          {title}
        </h2>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200">
          {tasks.length}
        </span>
      </header>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-32 flex-col gap-2 rounded-xl p-1 transition-colors ${isOver ? 'bg-purple-100/60 dark:bg-purple-900/20' : ''}`}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Drop tasks here
            </p>
          )}
        </div>
      </SortableContext>
    </section>
  );
};
