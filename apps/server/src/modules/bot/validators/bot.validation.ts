import { z } from 'zod';

// ==========================================
// AVAILABLE BOT (Admin CRUD)
// ==========================================

export const createAvailableBotSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),

  description: z
    .string({ message: 'Description is required' })
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must be less than 200 characters')
    .trim(),

  icon: z
    .string()
    .max(10, 'Icon must be a single emoji or short code')
    .trim()
    .optional(),

  isActive: z.boolean().optional().default(true),

  sortOrder: z.number().int().min(0).optional().default(0),

  // Capability IDs to connect (Prisma implicit M2M)
  capabilityIds: z
    .array(z.string().uuid('Invalid capability ID'))
    .min(1, 'At least one capability is required')
    .optional(),
});

export const updateAvailableBotSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .optional(),

  description: z
    .string()
    .min(5)
    .max(200)
    .trim()
    .optional(),

  icon: z.string().max(10).trim().optional(),

  isActive: z.boolean().optional(),

  sortOrder: z.number().int().min(0).optional(),
});

export const updateAvailableBotCapabilitiesSchema = z.object({
  capabilityIds: z
    .array(z.string().uuid('Invalid capability ID'))
    .min(1, 'At least one capability is required'),
});

export type UpdateAvailableBotCapabilitiesInput = z.infer<typeof updateAvailableBotCapabilitiesSchema>;

// ==========================================
// BOT CRUD
// ==========================================

export const createBotSchema = z.object({
  availableBotId: z
    .string({ message: 'Bot type is required' })
    .uuid('Invalid bot type ID'),

  name: z
    .string({ message: 'Bot name is required' })
    .min(1, 'Bot name cannot be empty')
    .max(50, 'Bot name must be less than 50 characters')
    .trim(),

  purpose: z
    .string()
    .max(200, 'Purpose must be less than 200 characters')
    .trim()
    .optional(),

  avatar: z
    .string()
    .max(10, 'Avatar must be a single emoji')
    .trim()
    .optional(),

  isPublic: z.boolean().optional().default(false),

  knowledgeMode: z.enum(['AI_ONLY', 'RAG', 'HYBRID']).optional().default('AI_ONLY'),

  selectedVoiceId: z
    .string()
    .uuid('Invalid voice ID')
    .optional()
    .nullable(),
});

export const updateBotSchema = z.object({
  name: z
    .string()
    .min(1, 'Bot name cannot be empty')
    .max(50, 'Bot name must be less than 50 characters')
    .trim()
    .optional(),

  purpose: z
    .string()
    .max(200, 'Purpose must be less than 200 characters')
    .trim()
    .optional(),

  avatar: z
    .string()
    .max(10, 'Avatar must be a single emoji')
    .trim()
    .optional(),

  isPublic: z.boolean().optional(),

  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});


// ==========================================
// CAPABILITY (Admin CRUD)
// ==========================================

export const createCapabilitySchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  description: z
    .string({ message: 'Description is required' })
    .min(5, 'Description must be at least 5 characters')
    .max(300, 'Description must be less than 300 characters')
    .trim(),

  availableBotId: z
    .string({ message: 'availableBotId is required' })
    .uuid('Invalid availableBotId'),
});

export const updateCapabilitySchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .trim()
    .optional(),

  description: z
    .string()
    .min(5)
    .max(300)
    .trim()
    .optional(),
});

// ==========================================
// CAPABILITY FUNCTION (Admin CRUD)
// ==========================================

export const createCapabilityFunctionSchema = z.object({
  name: z
    .string({ message: 'Function name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  description: z
    .string({ message: 'Description is required' })
    .min(5, 'Description must be at least 5 characters')
    .max(300, 'Description must be less than 300 characters')
    .trim(),
});

export const updateCapabilityFunctionSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .trim()
    .optional(),

  description: z
    .string()
    .min(5)
    .max(300)
    .trim()
    .optional(),
});

// ==========================================
// BOT CAPABILITY (User - enable/disable/settings)
// ==========================================

export const updateBotCapabilitySchema = z.object({
  isEnabled: z.boolean({ message: 'isEnabled must be a boolean' }),
  settings: z.record(z.string(),z.string()).optional().default({}),
});

// ==========================================
// KNOWLEDGE
// ==========================================

export const addKnowledgeSchema = z
  .object({
    type: z.enum(['DOCUMENT', 'NOTE', 'URL', 'FAQ'], {
      message: 'Type must be one of: DOCUMENT, NOTE, URL, FAQ',
    }),

    title: z
      .string({ message: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be less than 200 characters')
      .trim(),

    capabilityId: z
      .string()
      .uuid('Invalid capability ID')
      .optional(),

    // NOTE type
    content: z
      .string()
      .min(1, 'Content cannot be empty')
      .max(50000, 'Content too large (max 50,000 characters)')
      .trim()
      .optional(),

    // URL type
    sourceUrl: z
      .string()
      .url('Invalid URL format')
      .optional(),

    // FAQ type
    faqItems: z
      .array(
        z.object({
          question: z.string().min(1).max(500).trim(),
          answer: z.string().min(1).max(2000).trim(),
        })
      )
      .min(1, 'Add at least one FAQ item')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'NOTE' && !data.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Content is required for NOTE type',
        path: ['content'],
      });
    }

    if (data.type === 'URL' && !data.sourceUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'URL is required for URL type',
        path: ['sourceUrl'],
      });
    }

    if (data.type === 'FAQ' && (!data.faqItems || data.faqItems.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'FAQ items are required for FAQ type',
        path: ['faqItems'],
      });
    }
  });

// ==========================================
// TRAINING
// ==========================================

export const triggerTrainingSchema = z.object({
  capabilityId: z
    .string()
    .uuid('Invalid capability ID')
    .optional(), // optional - agar nahi diya toh sab capabilities train hongi
});

// ==========================================
// BOT CONFIG
// ==========================================

export const updateBotConfigSchema = z.object({
  tone: z
    .enum(['FORMAL', 'CASUAL', 'FRIENDLY', 'PROFESSIONAL', 'HUMOROUS'])
    .optional(),

  personality: z
    .object({
      traits: z.array(z.string().max(50)).max(10, 'Max 10 personality traits'),
      style: z.string().max(100),
    })
    .optional(),

  customPrompt: z
    .string()
    .max(1000, 'Custom prompt must be less than 1000 characters')
    .trim()
    .optional()
    .nullable(),

  primaryLanguage: z
    .string()
    .min(2, 'Language code must be at least 2 characters')
    .max(10)
    .optional(),

  secondaryLanguage: z
    .string()
    .min(2)
    .max(10)
    .optional()
    .nullable(),

  languageMixing: z.boolean().optional(),

  responseLength: z.enum(['SHORT', 'MEDIUM', 'DETAILED']).optional(),

  responseFormat: z
    .enum(['TEXT_ONLY', 'TEXT_WITH_EMOJI', 'MARKDOWN', 'RICH_TEXT'])
    .optional(),

  useEmoji: z.boolean().optional(),

  welcomeMessage: z
    .string()
    .max(200, 'Welcome message must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),

  fallbackMessage: z
    .string()
    .max(200, 'Fallback message must be less than 200 characters')
    .trim()
    .optional()
    .nullable(),

  voiceSpeed: z.enum(['SLOW', 'NORMAL', 'FAST']).optional(),

  voicePitch: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .nullable(),

  voiceVolume: z
    .number()
    .int()
    .min(0, 'Volume must be between 0 and 100')
    .max(100, 'Volume must be between 0 and 100')
    .optional(),

  typingDelay: z
    .number()
    .int()
    .min(0)
    .max(5000, 'Typing delay max 5 seconds')
    .optional(),

  autoGreet: z.boolean().optional(),

  rememberContext: z.boolean().optional(),
});

// ==========================================
// BOT RULES
// ==========================================

export const updateBotRulesSchema = z.object({
  profanityFilter: z.boolean().optional(),

  blockedWords: z
    .array(z.string().min(1).max(50).trim())
    .max(100, 'Max 100 blocked words')
    .optional(),

  avoidTopics: z
    .array(z.string().min(1).max(100).trim())
    .max(50, 'Max 50 avoided topics')
    .optional(),

  allowedTopics: z
    .array(z.string().min(1).max(100).trim())
    .max(50, 'Max 50 allowed topics')
    .optional(),

  sensitiveMode: z.boolean().optional(),

  maxResponseLength: z
    .number()
    .int()
    .min(100, 'Min response length is 100 characters')
    .max(10000, 'Max response length is 10,000 characters')
    .optional(),

  maxMessagesPerMin: z
    .number()
    .int()
    .min(1)
    .max(60)
    .optional(),

  sessionTimeout: z
    .number()
    .int()
    .min(5, 'Session timeout min 5 minutes')
    .max(1440, 'Session timeout max 24 hours')
    .optional(),

  canInitiateChat: z.boolean().optional(),
  canAccessUserData: z.boolean().optional(),
  canMakeToolCalls: z.boolean().optional(),
  canShareExternal: z.boolean().optional(),

  dataRetentionDays: z
    .number()
    .int()
    .min(1)
    .max(3650, 'Max data retention 10 years')
    .optional(),

  ageRestriction: z
    .number()
    .int()
    .min(0)
    .max(21)
    .optional(),

  doList: z
    .array(z.string().min(1).max(200).trim())
    .max(20, 'Max 20 rules in do list')
    .optional(),

  dontList: z
    .array(z.string().min(1).max(200).trim())
    .max(20, "Max 20 rules in don't list")
    .optional(),

  customInstructions: z
    .string()
    .max(2000, 'Custom instructions must be less than 2000 characters')
    .trim()
    .optional()
    .nullable(),
});

// ==========================================
// QUERY PARAMS
// ==========================================

export const botListQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  availableBotId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const knowledgeListQuerySchema = z.object({
  capabilityId: z.string().uuid().optional(),
  type: z.enum(['DOCUMENT', 'NOTE', 'URL', 'FAQ']).optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED']).optional(),
});

export const trainingListQuerySchema = z.object({
  capabilityId: z.string().uuid().optional(),
  status: z.enum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

// ==========================================
// BOT CHAT
// ==========================================

export const createBotChatSchema = z.object({
  title: z.string().max(100, 'Title must be less than 100 characters').trim().optional(),
});

export const sendBotMessageSchema = z.object({
  content: z
    .string({ message: 'Message content is required' })
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long (max 5000 characters)')
    .trim(),
});

export const botChatListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const botMessageListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

// ==========================================
// INFERRED TYPES
// ==========================================

// AvailableBot
export type CreateAvailableBotInput = z.infer<typeof createAvailableBotSchema>;
export type UpdateAvailableBotInput = z.infer<typeof updateAvailableBotSchema>;

// Capability
export type CreateCapabilityInput = z.infer<typeof createCapabilitySchema>;
export type UpdateCapabilityInput = z.infer<typeof updateCapabilitySchema>;

// CapabilityFunction
export type CreateCapabilityFunctionInput = z.infer<typeof createCapabilityFunctionSchema>;
export type UpdateCapabilityFunctionInput = z.infer<typeof updateCapabilityFunctionSchema>;

// BotCapability
export type UpdateBotCapabilityInput = z.infer<typeof updateBotCapabilitySchema>;

// Bot
export type CreateBotInput = z.infer<typeof createBotSchema>;
export type UpdateBotInput = z.infer<typeof updateBotSchema>;

// Knowledge
export type AddKnowledgeInput = z.infer<typeof addKnowledgeSchema>;

// Training
export type TriggerTrainingInput = z.infer<typeof triggerTrainingSchema>;

// Config & Rules
export type UpdateBotConfigInput = z.infer<typeof updateBotConfigSchema>;
export type UpdateBotRulesInput = z.infer<typeof updateBotRulesSchema>;

// Query Params
export type BotListQuery = z.infer<typeof botListQuerySchema>;
export type KnowledgeListQuery = z.infer<typeof knowledgeListQuerySchema>;
export type TrainingListQuery = z.infer<typeof trainingListQuerySchema>;

// Bot Chat
export type CreateBotChatInput = z.infer<typeof createBotChatSchema>;
export type SendBotMessageInput = z.infer<typeof sendBotMessageSchema>;
export type BotChatListQuery = z.infer<typeof botChatListQuerySchema>;
export type BotMessageListQuery = z.infer<typeof botMessageListQuerySchema>;
