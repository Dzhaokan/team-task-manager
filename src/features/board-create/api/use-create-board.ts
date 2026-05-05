import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postBoard, BOARDS_QUERY_KEY } from '@/shared/api';
import { useBoardStore } from '@/app/store/boardStore';

export const useCreateBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => postBoard(name),
    onSuccess: (board) => {
      useBoardStore.getState().ensureBoardSlot(board.id);
      void qc.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
};
