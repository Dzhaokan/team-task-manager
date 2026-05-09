import { useSyncExternalStore } from 'react';
import { DARK_MEDIA_QUERY } from '@/shared/config/theme';

const darkMQ = window.matchMedia(DARK_MEDIA_QUERY);

const subscribe = (notify: () => void) => {
  darkMQ.addEventListener('change', notify);
  return () => darkMQ.removeEventListener('change', notify);
};

const getSnapshot = () => darkMQ.matches;

const getServerSnapshot = () => false;

export const useSystemPrefersDark = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
