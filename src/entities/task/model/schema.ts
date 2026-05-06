import { z } from 'zod';
import type { Priority } from './types';

export const PRIORITIES = ['low', 'medium', 'high'] as const;

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_SHORT_LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
};

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Max 120 characters'),
  description: z.string().trim().max(2000, 'Max 2000 characters'),
  priority: z.enum(PRIORITIES),
  tags: z.string().max(200, 'Max 200 characters'),
  deadline: z.string(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const emptyTaskForm = (): TaskFormValues => ({
  title: '',
  description: '',
  priority: 'medium',
  tags: '',
  deadline: '',
});
