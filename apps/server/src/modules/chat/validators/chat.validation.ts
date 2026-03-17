import { z } from 'zod';

export const createChatSchema = z.object({
  botVoiceId: z.string().uuid('Invalid botVoiceId'),
  name: z.string().max(100).trim().optional(),
  usedFor: z.string().max(200).trim().optional(),
});

export const endSessionSchema = z.object({
  userFeedback: z
    .object({
      rating: z.number().int().min(1).max(5).optional(),
      comment: z.string().max(500).trim().optional(),
    })
    .optional(),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type EndSessionInput = z.infer<typeof endSessionSchema>;
