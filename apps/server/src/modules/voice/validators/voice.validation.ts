import { z } from 'zod';

export const createVoiceSchema = z.object({
  voiceName: z
    .string({ message: 'Voice name is required' })
    .min(1, 'Voice name is required')
    .max(50, 'Voice name must be less than 50 characters')
    .trim(),

  relation: z
    .string({ message: 'Relation is required' })
    .min(1, 'Relation is required')
    .max(50, 'Relation must be less than 50 characters')
    .trim(),

  language: z.string().min(2).max(10).default('hi'),

  slangs: z
    .array(z.string().max(30).trim())
    .max(20, 'Maximum 20 slangs allowed')
    .optional()
    .default([]),

  aiCallUserAs: z.string().max(30).trim().optional(),
});

export type CreateVoiceInput = z.infer<typeof createVoiceSchema>;
