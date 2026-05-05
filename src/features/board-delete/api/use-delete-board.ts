import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBoardRequest, BOARDS_QUERY_KEY } from '@/shared/api';
import { useBoardStore } from '@/app/store/boardStore';

export const useDeleteBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBoardRequest(id),
    onSuccess: (_, id) => {
      useBoardStore.getState().removeBoardTasks(id);
      void qc.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
};
