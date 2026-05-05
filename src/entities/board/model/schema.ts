import { z } from 'zod';

export const boardNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(60, 'Keep it under 60 characters'),
});

export type BoardNameValues = z.infer<typeof boardNameSchema>;
