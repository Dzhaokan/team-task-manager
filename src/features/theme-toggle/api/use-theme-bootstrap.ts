import { useEffect } from 'react';
import { selectThemeMode, useThemeStore } from '@/app/store/themeStore';
import { applyTheme } from '../lib/apply-theme';
import { resolveTheme } from '../lib/resolve-theme';
import { useSystemPrefersDark } from '../lib/use-system-prefers-dark';

export const useThemeBootstrap = (): void => {
  const mode = useThemeStore(selectThemeMode);
  const systemDark = useSystemPrefersDark();

  useEffect(() => {
    applyTheme(resolveTheme(mode, systemDark));
  }, [mode, systemDark]);
};
