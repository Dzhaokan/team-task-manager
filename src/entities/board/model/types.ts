import type { BoardId } from '@/shared/config/ids';

export type Board = {
  id: BoardId;
  name: string;
  createdAt: string;
};
