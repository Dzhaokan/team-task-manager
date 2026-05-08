import { useMutation } from '@tanstack/react-query';
import { postRegister } from '@/shared/api';
import { useAuthStore } from '@/app/store/authStore';

export const useRegister = () =>
  useMutation({
    mutationFn: postRegister,
    onSuccess: ({ token, user }) => {
      useAuthStore.getState().setSession(token, user);
    },
  });
