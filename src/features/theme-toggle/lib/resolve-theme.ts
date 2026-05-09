import type { ResolvedTheme, ThemeMode } from '@/shared/config/theme';

export const resolveTheme = (
  mode: ThemeMode,
  systemDark: boolean
): ResolvedTheme => {
  if (mode !== 'system') return mode;
  return systemDark ? 'dark' : 'light';
};
