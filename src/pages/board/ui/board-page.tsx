import { useState } from 'react';
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
import { findColumnContaining, useBoardStore } from '@/app/store/boardStore';
import { isColumnId } from '@/shared/config/columns';
import { DEFAULT_BOARD_ID } from '@/shared/config/ids';

export const BoardPage = () => {
  const reorderWithinColumn = useBoardStore((s) => s.reorderWithinColumn);
  const moveAcrossColumns = useBoardStore((s) => s.moveAcrossColumns);
  const [activeTaskId, setActiveTaskId] = useState<TaskId | null>(null);

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
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const { columnOrderByBoard } = useBoardStore.getState();
    const from = findColumnContaining(
      DEFAULT_BOARD_ID,
      activeId,
      columnOrderByBoard
    );
    const to = isColumnId(overId)
      ? overId
      : findColumnContaining(DEFAULT_BOARD_ID, overId, columnOrderByBoard);
    if (!from || !to || from === to) return;

    moveAcrossColumns(
      DEFAULT_BOARD_ID,
      activeId,
      from,
      to,
      isColumnId(overId) ? null : overId
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null);
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId || isColumnId(overId)) return;

    const { columnOrderByBoard } = useBoardStore.getState();
    const from = findColumnContaining(
      DEFAULT_BOARD_ID,
      activeId,
      columnOrderByBoard
    );
    const to = findColumnContaining(
      DEFAULT_BOARD_ID,
      overId,
      columnOrderByBoard
    );
    if (!from || from !== to) return;

    reorderWithinColumn(DEFAULT_BOARD_ID, from, activeId, overId);
  };

  const handleDragCancel = () => setActiveTaskId(null);

  const activeTask = useBoardStore((s) =>
    activeTaskId ? s.tasksById[activeTaskId] : null
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Board
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
              boardId={DEFAULT_BOARD_ID}
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
