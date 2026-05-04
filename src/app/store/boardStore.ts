import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import {
  SEED_TASKS_BY_COLUMN,
  type Task,
  type TaskId,
  type TaskInput,
  type TaskPatch,
} from '@/entities/task';
import { COLUMN_IDS, type ColumnId } from '@/shared/config/columns';
import { DEFAULT_BOARD_ID, type BoardId } from '@/shared/config/ids';
import { generateId } from '@/shared/lib/generate-id';

type ColumnSlot = Record<ColumnId, TaskId[]>;
type ColumnOrderByBoard = Record<BoardId, ColumnSlot>;

type State = {
  tasksById: Record<TaskId, Task>;
  columnOrderByBoard: ColumnOrderByBoard;
};

type Actions = {
  reorderWithinColumn: (
    boardId: BoardId,
    columnId: ColumnId,
    activeId: TaskId,
    overId: TaskId
  ) => void;
  moveAcrossColumns: (
    boardId: BoardId,
    activeId: TaskId,
    from: ColumnId,
    to: ColumnId,
    overId: TaskId | null
  ) => void;
  ensureBoardSlot: (boardId: BoardId) => void;
  removeBoardTasks: (boardId: BoardId) => void;
  addTask: (boardId: BoardId, columnId: ColumnId, input: TaskInput) => Task;
  updateTask: (taskId: TaskId, patch: TaskPatch) => void;
  deleteTask: (taskId: TaskId) => void;
};

const emptyColumnSlot = (): ColumnSlot =>
  Object.fromEntries(
    COLUMN_IDS.map((col) => [col, [] as TaskId[]])
  ) as unknown as ColumnSlot;

const buildInitialState = (): State => {
  const tasksById: Record<TaskId, Task> = {};
  const columnOrderByBoard: ColumnOrderByBoard = {
    [DEFAULT_BOARD_ID]: emptyColumnSlot(),
  };

  for (const columnId of COLUMN_IDS) {
    const tasks = SEED_TASKS_BY_COLUMN[columnId];
    columnOrderByBoard[DEFAULT_BOARD_ID][columnId] = tasks.map((t) => t.id);
    for (const task of tasks) tasksById[task.id] = task;
  }

  return { tasksById, columnOrderByBoard };
};

export const useBoardStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...buildInitialState(),

      reorderWithinColumn: (boardId, columnId, activeId, overId) =>
        set((state) => {
          const slot = state.columnOrderByBoard[boardId];
          if (!slot) return state;
          const ids = slot[columnId];
          const fromIndex = ids.indexOf(activeId);
          const toIndex = ids.indexOf(overId);
          if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
            return state;
          }
          return {
            columnOrderByBoard: {
              ...state.columnOrderByBoard,
              [boardId]: {
                ...slot,
                [columnId]: arrayMove(ids, fromIndex, toIndex),
              },
            },
          };
        }),

      moveAcrossColumns: (boardId, activeId, from, to, overId) =>
        set((state) => {
          if (from === to) return state;
          const slot = state.columnOrderByBoard[boardId];
          if (!slot) return state;
          const sourceIds = slot[from];
          if (!sourceIds.includes(activeId)) return state;

          const targetIds = slot[to];
          const insertAt =
            overId === null ? targetIds.length : targetIds.indexOf(overId);
          const safeInsertAt = insertAt === -1 ? targetIds.length : insertAt;

          return {
            columnOrderByBoard: {
              ...state.columnOrderByBoard,
              [boardId]: {
                ...slot,
                [from]: sourceIds.filter((id) => id !== activeId),
                [to]: [
                  ...targetIds.slice(0, safeInsertAt),
                  activeId,
                  ...targetIds.slice(safeInsertAt),
                ],
              },
            },
          };
        }),

      ensureBoardSlot: (boardId) =>
        set((state) => {
          if (state.columnOrderByBoard[boardId]) return state;
          return {
            columnOrderByBoard: {
              ...state.columnOrderByBoard,
              [boardId]: emptyColumnSlot(),
            },
          };
        }),

      removeBoardTasks: (boardId) =>
        set((state) => {
          if (!state.columnOrderByBoard[boardId]) return state;
          const nextById: Record<TaskId, Task> = {};
          for (const [id, task] of Object.entries(state.tasksById)) {
            if (task.boardId !== boardId) nextById[id] = task;
          }
          const nextByBoard = { ...state.columnOrderByBoard };
          delete nextByBoard[boardId];
          return {
            tasksById: nextById,
            columnOrderByBoard: nextByBoard,
          };
        }),

      addTask: (boardId, columnId, input) => {
        const task: Task = {
          id: generateId('t'),
          boardId,
          assigneeId: null,
          createdAt: new Date().toISOString(),
          ...input,
        };
        set((state) => {
          const slot = state.columnOrderByBoard[boardId];
          if (!slot) return state;
          return {
            tasksById: { ...state.tasksById, [task.id]: task },
            columnOrderByBoard: {
              ...state.columnOrderByBoard,
              [boardId]: {
                ...slot,
                [columnId]: [...slot[columnId], task.id],
              },
            },
          };
        });
        return task;
      },

      updateTask: (taskId, patch) =>
        set((state) => {
          const existing = state.tasksById[taskId];
          if (!existing) return state;
          return {
            tasksById: {
              ...state.tasksById,
              [taskId]: { ...existing, ...patch },
            },
          };
        }),

      deleteTask: (taskId) =>
        set((state) => {
          const task = state.tasksById[taskId];
          if (!task) return state;
          const remaining: Record<TaskId, Task> = {};
          for (const [id, t] of Object.entries(state.tasksById)) {
            if (id !== taskId) remaining[id] = t;
          }
          const slot = state.columnOrderByBoard[task.boardId];
          if (!slot) return { tasksById: remaining };
          const nextSlot = Object.fromEntries(
            COLUMN_IDS.map((col) => [
              col,
              slot[col].filter((id) => id !== taskId),
            ])
          ) as unknown as ColumnSlot;
          return {
            tasksById: remaining,
            columnOrderByBoard: {
              ...state.columnOrderByBoard,
              [task.boardId]: nextSlot,
            },
          };
        }),
    }),
    {
      name: 'board-store-v2',
      partialize: ({ tasksById, columnOrderByBoard }) => ({
        tasksById,
        columnOrderByBoard,
      }),
    }
  )
);

export const selectColumnTasks =
  (boardId: BoardId, columnId: ColumnId) =>
  (state: State): Task[] => {
    const slot = state.columnOrderByBoard[boardId];
    if (!slot) return [];
    return slot[columnId]
      .map((id) => state.tasksById[id])
      .filter((t): t is Task => !!t);
  };

export const selectBoardTaskCount =
  (boardId: BoardId) =>
  (state: State): number => {
    const slot = state.columnOrderByBoard[boardId];
    if (!slot) return 0;
    return COLUMN_IDS.reduce((sum, col) => sum + slot[col].length, 0);
  };

export const selectBoardTags =
  (boardId: BoardId) =>
  (state: State): string[] => {
    const slot = state.columnOrderByBoard[boardId];
    if (!slot) return [];
    const seen = new Set<string>();
    for (const columnId of COLUMN_IDS) {
      for (const taskId of slot[columnId]) {
        const task = state.tasksById[taskId];
        if (!task) continue;
        for (const tag of task.tags) seen.add(tag);
      }
    }
    return Array.from(seen).sort();
  };

export const findColumnContaining = (
  boardId: BoardId,
  taskId: TaskId,
  columnOrderByBoard: ColumnOrderByBoard
): ColumnId | null => {
  const slot = columnOrderByBoard[boardId];
  if (!slot) return null;
  for (const columnId of COLUMN_IDS) {
    if (slot[columnId].includes(taskId)) return columnId;
  }
  return null;
};
