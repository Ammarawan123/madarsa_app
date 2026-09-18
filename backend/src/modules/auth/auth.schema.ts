import { z } from 'zod';

// Login Input Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Sahi email address likhein'),
  password: z.string().min(6, 'Password kam se kam 6 characters ka hona chahiye'),
});

export type LoginInput = z.infer<typeof loginSchema>;