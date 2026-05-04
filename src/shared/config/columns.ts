export type ColumnId = 'todo' | 'in-progress' | 'done';

export const COLUMN_IDS: readonly ColumnId[] = [
  'todo',
  'in-progress',
  'done',
] as const;

export const isColumnId = (value: string): value is ColumnId =>
  (COLUMN_IDS as readonly string[]).includes(value);
