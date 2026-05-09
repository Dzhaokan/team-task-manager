import { selectThemeMode, useThemeStore } from '@/app/store/themeStore';
import { MoonIcon, SunIcon } from '@/shared/ui/icon';
import { resolveTheme } from '../lib/resolve-theme';
import { useSystemPrefersDark } from '../lib/use-system-prefers-dark';

export const ThemeToggle = () => {
  const mode = useThemeStore(selectThemeMode);
  const setMode = useThemeStore((state) => state.setMode);
  const systemDark = useSystemPrefersDark();
  const resolved = resolveTheme(mode, systemDark);
  const next = resolved === 'dark' ? 'light' : 'dark';
  const Icon = resolved === 'dark' ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-label={`Switch to ${next} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
    >
      <Icon />
    </button>
  );
};
