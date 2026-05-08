import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/entities/user';

type State = {
  token: string | null;
  user: User | null;
};

type Actions = {
  setSession: (token: string, user: User) => void;
  updateUser: (patch: Partial<Pick<User, 'name' | 'avatar'>>) => void;
  clear: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setSession: (token, user) => set({ token, user }),

      updateUser: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state
        ),

      clear: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-store-v1',
      partialize: ({ token, user }) => ({ token, user }),
    }
  )
);

export const selectIsAuthed = (state: State): boolean =>
  state.token !== null && state.user !== null;

export const selectCurrentUser = (state: State): User | null => state.user;

export const selectToken = (state: State): string | null => state.token;
