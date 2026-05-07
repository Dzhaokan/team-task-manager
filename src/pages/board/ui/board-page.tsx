import { useEffect, useMemo, useRef, useState } from 'react';
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
import { TaskCardView, type Task, type TaskId } from '@/entities/task';
import { BoardColumn } from '@/widgets/board-column';
import { useBoards } from '@/features/board-list';
import {
  CreateTaskModal,
  type CreateTaskTarget,
} from '@/features/task-create';
import { EditTaskModal } from '@/features/task-edit';
import { DeleteTaskModal } from '@/features/task-delete';
import {
  BoardFilterBar,
  matchesFilter,
  useBoardFilter,
} from '@/features/board-filter';
import { findColumnContaining, useBoardStore } from '@/app/store/boardStore';
import { isColumnId, type ColumnId } from '@/shared/config/columns';
import { ChevronLeftIcon } from '@/shared/ui/icon';
import { ROUTES } from '@/app/router';

export const BoardPage = () => {
  const { boardId = '' } = useParams<{ boardId: string }>();
  const { data: boards, isPending } = useBoards();
  const board = boards?.find((b) => b.id === boardId) ?? null;

  const reorderWithinColumn = useBoardStore((s) => s.reorderWithinColumn);
  const moveAcrossColumns = useBoardStore((s) => s.moveAcrossColumns);
  const [activeTaskId, setActiveTaskId] = useState<TaskId | null>(null);
  const recentlyMovedAcross = useRef(false);
  const columnOrderByBoard = useBoardStore((s) => s.columnOrderByBoard);

  const [createTarget, setCreateTarget] = useState<CreateTaskTarget | null>(
    null
  );
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const { filter, isActive: isFilterActive } = useBoardFilter();
  const predicate = useMemo(
    () => (task: Task) => matchesFilter(task, filter),
    [filter]
  );

  useEffect(() => {
    if (!board?.id) return;
    useBoardStore.getState().ensureBoardSlot(board.id);
  }, [board?.id]);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedAcross.current = false;
    });
  }, [columnOrderByBoard]);

  const pointerOptions = useMemo(
    () => ({ activationConstraint: { distance: 6 } }),
    []
  );
  const keyboardOptions = useMemo(
    () => ({ coordinateGetter: sortableKeyboardCoordinates }),
    []
  );
  const sensors = useSensors(
    useSensor(PointerSensor, pointerOptions),
    useSensor(KeyboardSensor, keyboardOptions)
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(String(active.id));
    recentlyMovedAcross.current = false;
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!board || !over) return;
    if (recentlyMovedAcross.current) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const { columnOrderByBoard: order } = useBoardStore.getState();
    const from = findColumnContaining(board.id, activeId, order);
    const to = isColumnId(overId)
      ? overId
      : findColumnContaining(board.id, overId, order);
    if (!from || !to || from === to) return;

    recentlyMovedAcross.current = true;
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

    const { columnOrderByBoard: order } = useBoardStore.getState();
    const from = findColumnContaining(board.id, activeId, order);
    const to = findColumnContaining(board.id, overId, order);
    if (!from || from !== to) return;

    reorderWithinColumn(board.id, from, activeId, overId);
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
    recentlyMovedAcross.current = false;
  };

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

  const handleCreate = (columnId: ColumnId) =>
    setCreateTarget({ boardId: board.id, columnId });

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
        <BoardFilterBar boardId={board.id} />
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
              predicate={isFilterActive ? predicate : undefined}
              onCreate={handleCreate}
              onEditTask={setEditTarget}
              onDeleteTask={setDeleteTarget}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardView task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {createTarget && (
        <CreateTaskModal
          target={createTarget}
          onClose={() => setCreateTarget(null)}
        />
      )}
      {editTarget && (
        <EditTaskModal task={editTarget} onClose={() => setEditTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteTaskModal
          task={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
