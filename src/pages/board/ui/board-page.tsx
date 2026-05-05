import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { COLUMN_DEFS } from '@/entities/board';
import { TaskCard, type TaskId } from '@/entities/task';
import { BoardColumn } from '@/widgets/board-column';
import { useBoards } from '@/features/board-list';
import { findColumnContaining, useBoardStore } from '@/app/store/boardStore';
import { isColumnId } from '@/shared/config/columns';
import { ChevronLeftIcon } from '@/shared/ui/icon';
import { ROUTES } from '@/app/router';

export const BoardPage = () => {
  const { boardId = '' } = useParams<{ boardId: string }>();
  const { data: boards, isPending } = useBoards();
  const board = boards?.find((b) => b.id === boardId) ?? null;

  const ensureBoardSlot = useBoardStore((s) => s.ensureBoardSlot);
  const reorderWithinColumn = useBoardStore((s) => s.reorderWithinColumn);
  const moveAcrossColumns = useBoardStore((s) => s.moveAcrossColumns);
  const [activeTaskId, setActiveTaskId] = useState<TaskId | null>(null);

  useEffect(() => {
    if (board?.id) ensureBoardSlot(board.id);
  }, [board?.id, ensureBoardSlot]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(String(active.id));
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!board || !over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const { columnOrderByBoard } = useBoardStore.getState();
    const from = findColumnContaining(board.id, activeId, columnOrderByBoard);
    const to = isColumnId(overId)
      ? overId
      : findColumnContaining(board.id, overId, columnOrderByBoard);
    if (!from || !to || from === to) return;

    moveAcrossColumns(
      board.id,
      activeId,
      from,
      to,
      isColumnId(overId) ? null : overId
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null);
    if (!board || !over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId || isColumnId(overId)) return;

    const { columnOrderByBoard } = useBoardStore.getState();
    const from = findColumnContaining(board.id, activeId, columnOrderByBoard);
    const to = findColumnContaining(board.id, overId, columnOrderByBoard);
    if (!from || from !== to) return;

    reorderWithinColumn(board.id, from, activeId, overId);
  };

  const handleDragCancel = () => setActiveTaskId(null);

  const activeTask = useBoardStore((s) =>
    activeTaskId ? s.tasksById[activeTaskId] : null
  );

  if (isPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  if (!board) {
    return <Navigate to={ROUTES.boards} replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6">
        <Link
          to={ROUTES.boards}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ChevronLeftIcon /> Boards
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {board.name}
        </h1>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {COLUMN_DEFS.map((col) => (
            <BoardColumn
              key={col.id}
              boardId={board.id}
              columnId={col.id}
              title={col.title}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
