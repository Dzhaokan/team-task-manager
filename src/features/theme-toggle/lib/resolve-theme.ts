import type { ResolvedTheme, ThemeMode } from '@/shared/config/theme';

export const resolveTheme = (
  mode: ThemeMode,
  systemDark: boolean
): ResolvedTheme =>
  mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
