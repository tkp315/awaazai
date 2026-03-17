import { z } from 'zod';

export const updateProfileSchema = z.object({
  age: z.number().int().positive().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export const upsertPreferencesSchema = z.object({
  talkType: z.enum(['CASUAL', 'FORMAL', 'FRIENDLY', 'MOTIVATIONAL', 'STORYTELLING']).optional(),
  talkingTone: z.enum(['CALM', 'WARM', 'ENERGETIC', 'SERIOUS', 'HUMOROUS']).optional(),
  emotion: z.enum(['HAPPY', 'NEUTRAL', 'EMPATHETIC', 'ENCOURAGING', 'RELAXED']).optional(),
  responseLength: z.enum(['SHORT', 'MEDIUM', 'DETAILED']).optional(),
  preferredLanguage: z.string().min(2).max(10).optional(),
  voiceSpeed: z.enum(['SLOW', 'NORMAL', 'FAST']).optional(),
  topicsOfInterest: z.array(z.string()).optional(),
  avoidTopics: z.array(z.string()).optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(), // "HH:MM"
  dailyGoalMinutes: z.number().int().positive().optional(),
});
