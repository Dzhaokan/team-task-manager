import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export type LoginValues = z.infer<typeof loginSchema>;
