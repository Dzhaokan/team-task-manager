import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Max 60 characters'),
  avatar: z.string().nullable(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
