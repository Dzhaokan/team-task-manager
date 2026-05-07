import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { selectBoardTags, useBoardStore } from '@/app/store/boardStore';
import type { BoardId } from '@/shared/config/ids';

export const useBoardTagOptions = (boardId: BoardId): string[] => {
  const selector = useMemo(() => selectBoardTags(boardId), [boardId]);
  return useBoardStore(useShallow(selector));
};
