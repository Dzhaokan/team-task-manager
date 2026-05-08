import { useMutation } from '@tanstack/react-query';
import { patchUserMe } from '@/shared/api';
import { useAuthStore } from '@/app/store/authStore';

type ProfilePatch = { name?: string; avatar?: string | null };

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (patch: ProfilePatch) =>
      patchUserMe({
        ...patch,
        ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      }),
    onSuccess: (user) => {
      useAuthStore.getState().updateUser({
        name: user.name,
        avatar: user.avatar,
      });
    },
  });
