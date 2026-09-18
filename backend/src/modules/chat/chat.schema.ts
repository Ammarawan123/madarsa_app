import { z } from 'zod';

export const contactsSearchSchema = z.object({
  search: z.string().optional(),
});

export const openThreadSchema = z.object({
  studentId: z.number().int().positive(),
});

export const threadIdParamSchema = z.object({
  threadId: z.string().regex(/^\d+$/, 'Invalid thread id').transform(Number),
});

export const sendMessageSchema = z.object({
  threadId: z.number().int().positive(),
  messageText: z.string().min(1, 'Message cannot be empty'),
});