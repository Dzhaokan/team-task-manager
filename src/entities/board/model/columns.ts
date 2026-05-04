import type { ColumnId } from '@/shared/config/columns';

export type ColumnDef = {
  id: ColumnId;
  title: string;
};

export const COLUMN_DEFS: readonly ColumnDef[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
] as const;
