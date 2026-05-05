import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchBoard, BOARDS_QUERY_KEY } from '@/shared/api';

type RenameVars = { id: string; name: string };

export const useRenameBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: RenameVars) => patchBoard(id, name),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: BOARDS_QUERY_KEY });
    },
  });
};
