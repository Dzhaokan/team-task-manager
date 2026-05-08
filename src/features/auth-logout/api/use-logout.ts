import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLogout } from '@/shared/api';
import { useAuthStore } from '@/app/store/authStore';

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postLogout,
    onSettled: () => {
      useAuthStore.getState().clear();
      qc.clear();
    },
  });
};
