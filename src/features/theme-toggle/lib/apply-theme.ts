import type { ResolvedTheme } from '@/shared/config/theme';

export const applyTheme = (resolved: ResolvedTheme): void => {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
};
