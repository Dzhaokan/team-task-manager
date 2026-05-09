import type { ReactNode } from 'react';
import { useThemeBootstrap } from '@/features/theme-toggle';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useThemeBootstrap();
  return <>{children}</>;
};
