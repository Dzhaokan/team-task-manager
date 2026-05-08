import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError, AUTH_ME_QUERY_KEY, getAuthMe } from '@/shared/api';
import { selectToken, useAuthStore } from '@/app/store/authStore';

export const useAuthBootstrap = () => {
  const token = useAuthStore(selectToken);

  const query = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getAuthMe,
    enabled: token !== null,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!token || !query.data) return;
    useAuthStore.getState().setSession(token, query.data);
  }, [token, query.data]);

  useEffect(() => {
    if (!token) return;
    if (query.error instanceof ApiError && query.error.status === 401) {
      useAuthStore.getState().clear();
    }
  }, [token, query.error]);
};
