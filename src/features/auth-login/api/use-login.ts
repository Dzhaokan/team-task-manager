import { useMutation } from '@tanstack/react-query';
import { postLogin } from '@/shared/api';
import { useAuthStore } from '@/app/store/authStore';

export const useLogin = () =>
  useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      postLogin(input.email, input.password),
    onSuccess: ({ token, user }) => {
      useAuthStore.getState().setSession(token, user);
    },
  });
