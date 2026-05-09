import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/shared/config/theme';

type State = {
  mode: ThemeMode;
};

type Actions = {
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<State & Actions>()(
  persist(
    (set) => ({
      mode: DEFAULT_THEME_MODE,

      setMode: (mode) => set({ mode }),
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: ({ mode }) => ({ mode }),
    }
  )
);

export const selectThemeMode = (state: State): ThemeMode => state.mode;
