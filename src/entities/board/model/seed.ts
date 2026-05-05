import { DEFAULT_BOARD_ID } from '@/shared/config/ids';
import type { Board } from './types';

export const SEED_BOARDS: readonly Board[] = [
  {
    id: DEFAULT_BOARD_ID,
    name: 'Мой первый проект',
    createdAt: '2026-05-06T09:00:00.000Z',
  },
] as const;
