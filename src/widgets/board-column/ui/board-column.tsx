import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useShallow } from 'zustand/react/shallow';
import { TaskCard, type Task } from '@/entities/task';
import { selectColumnTasks, useBoardStore } from '@/app/store/boardStore';
import type { ColumnId } from '@/shared/config/columns';
import type { BoardId } from '@/shared/config/ids';
import { PlusIcon } from '@/shared/ui/icon';

type BoardColumnProps = {
  boardId: BoardId;
  columnId: ColumnId;
  title: string;
  predicate?: (task: Task) => boolean;
  onCreate: (columnId: ColumnId) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

export const BoardColumn = ({
  boardId,
  columnId,
  title,
  predicate,
  onCreate,
  onEditTask,
  onDeleteTask,
}: BoardColumnProps) => {
  const tasksSelector = useMemo(
    () => selectColumnTasks(boardId, columnId),
    [boardId, columnId]
  );
  const tasks = useBoardStore(useShallow(tasksSelector));
  const isFiltered = Boolean(predicate);
  const visible = predicate ? tasks.filter(predicate) : tasks;
  const taskIds = useMemo(() => visible.map((t) => t.id), [visible]);
  const droppableData = useMemo(
    () => ({ type: 'column', columnId }),
    [columnId]
  );
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: droppableData,
    disabled: isFiltered,
  });

  return (
    <section className="flex w-full min-w-0 flex-col rounded-2xl bg-gray-100 p-3 md:w-80 dark:bg-gray-900">
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
          {title}
        </h2>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200">
          {isFiltered ? `${visible.length} / ${tasks.length}` : tasks.length}
        </span>
      </header>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-32 flex-col gap-2 rounded-xl p-1 transition-colors ${isOver ? 'bg-purple-100/60 dark:bg-purple-900/20' : ''}`}
        >
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              dndDisabled={isFiltered}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          {visible.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
              {isFiltered ? 'No tasks match' : 'No tasks yet'}
            </p>
          )}
        </div>
      </SortableContext>

      <button
        type="button"
        onClick={() => onCreate(columnId)}
        className="mt-2 inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        <PlusIcon /> Add task
      </button>
    </section>
  );
};
