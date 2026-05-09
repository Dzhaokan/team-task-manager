export const THEME_MODES = ['light', 'dark', 'system'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export type ResolvedTheme = 'light' | 'dark';

export const DEFAULT_THEME_MODE: ThemeMode = 'system';

// Keep in sync with the inline pre-paint script in index.html.
export const THEME_STORAGE_KEY = 'theme-store-v1';

export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';
