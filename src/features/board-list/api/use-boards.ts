import { useQuery } from '@tanstack/react-query';
import { fetchBoards, BOARDS_QUERY_KEY } from '@/shared/api';

export const useBoards = () =>
  useQuery({
    queryKey: BOARDS_QUERY_KEY,
    queryFn: fetchBoards,
  });
