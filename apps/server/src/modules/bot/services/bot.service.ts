import { getPrisma } from '@lib/services/database/prisma/index.js';
import type {
  CreateBotInput,
  UpdateBotInput,
  AddKnowledgeInput,
  UpdateBotConfigInput,
  UpdateBotRulesInput,
  UpdateBotCapabilityInput,
  BotListQuery,
  KnowledgeListQuery,
  TrainingListQuery,
} from '../validators/bot.validation.js';
import type { AvailableBot } from 'generated/prisma/client.js';
import { getQueue } from '@lib/services/queue/client.js';

// Full bot include — used in getBot, createBot
const BOT_INCLUDE = {
  availableBot: { include: { capabilities: { include: { functions: true } } } },
  capability: { include: { capability: { include: { functions: true } } } },
  config: true,
  rules: true,
  trainings: { orderBy: { createdAt: 'desc' as const }, take: 1 },
  botVoices: {
    where: { status: 'READY' as const },
    select: { id: true, voiceName: true, relation: true, status: true, language: true, elvenlabsVoiceId: true },
  },
  selectedVoice: {
    select: { id: true, voiceName: true, relation: true, status: true, language: true },
  },
  _count: { select: { knowledge: true, trainings: true } },
} as const;

export const botService = {
  // ==========================================
  // AVAILABLE BOTS
  // ==========================================

  getAvailableBots: async () => {
    const prisma = getPrisma();
    return await prisma.availableBot.findMany({
      where: { isActive: true },
      include: { capabilities: { include: { functions: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  },

  getActiveAvailableBot: async (availableBotId: string) => {
    const prisma = getPrisma();
    return await prisma.availableBot.findFirst({
      where: { id: availableBotId, isActive: true },
      include: { capabilities: true },
    });
  },

  // ==========================================
  // BOT CRUD
  // ==========================================

  createBot: async (
    userId: string,
    data: CreateBotInput,
    availableBot: AvailableBot & { capabilities: { id: string }[] }
  ) => {
    const prisma = getPrisma();

    return await prisma.bot.create({
      data: {
        name: data.name,
        purpose: data.purpose,
        avatar: data.avatar ?? '🤖',
        isPublic: data.isPublic ?? false,
        knowledgeMode: data.knowledgeMode ?? 'AI_ONLY',
        selectedVoiceId: data.selectedVoiceId ?? null,
        userId,
        availableBotId: data.availableBotId,
        // Auto-create BotCapability for each capability in the template
        capability: {
          create: availableBot.capabilities.map(cap => ({
            capabilityId: cap.id,
            isEnabled: true,
            settings: {},
          })),
        },
        // Create default config
        config: {
          create: {},
        },
        // Create default rules
        rules: {
          create: {},
        },
      },
      include: BOT_INCLUDE,
    });
  },

  getBots: async (userId: string, query: BotListQuery) => {
    const prisma = getPrisma();
    const { status, page, limit, availableBotId } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status ? { status } : {}),
      ...(availableBotId ? { availableBotId } : {}),
    };

    const [bots, total] = await Promise.all([
      prisma.bot.findMany({
        where,
        include: {
          availableBot: true,
          capability: { include: { capability: true } },
          botVoices: {
            where: { status: 'READY' },
            select: { id: true, voiceName: true, relation: true, status: true, language: true, elvenlabsVoiceId: true },
          },
          _count: { select: { knowledge: true, trainings: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bot.count({ where }),
    ]);

    return { bots, total, page, limit };
  },

  getBotById: async (botId: string, userId: string) => {
    const prisma = getPrisma();
    return await prisma.bot.findFirst({
      where: { id: botId, userId },
      include: BOT_INCLUDE,
    });
  },

  updateBot: async (botId: string, data: UpdateBotInput) => {
    const prisma = getPrisma();
    return await prisma.bot.update({
      where: { id: botId },
      data,
      include: BOT_INCLUDE,
    });
  },

  deleteBot: async (botId: string) => {
    const prisma = getPrisma();
    // Soft delete
    return await prisma.bot.update({
      where: { id: botId },
      data: { status: 'INACTIVE' },
    });
  },

  // ==========================================
  // BOT CAPABILITY
  // ==========================================

  updateBotCapability: async (
    botId: string,
    capabilityId: string,
    data: UpdateBotCapabilityInput
  ) => {
    const prisma = getPrisma();

    const existing = await prisma.botCapability.findFirst({
      where: { botId, capabilityId },
    });

    if (!existing) return null;

    return await prisma.botCapability.update({
      where: { id: existing.id },
      data: {
        isEnabled: data.isEnabled,
        settings: data.settings ?? {},
      },
      include: { capability: { include: { functions: true } } },
    });
  },

  // ==========================================
  // KNOWLEDGE
  // ==========================================

  addKnowledge: async (botId: string, data: AddKnowledgeInput) => {
    const prisma = getPrisma();

    return await prisma.botKnowledge.create({
      data: {
        botId,
        type: data.type,
        title: data.title,
        content: data.content ?? null,
        sourceUrl: data.sourceUrl ?? null,
        capabilityId: data.capabilityId ?? null,
        status: 'PENDING',
      },
    });
  },

  getKnowledge: async (botId: string, query: KnowledgeListQuery) => {
    const prisma = getPrisma();
    return await prisma.botKnowledge.findMany({
      where: {
        botId,
        ...(query.capabilityId ? { capabilityId: query.capabilityId } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  getKnowledgeById: async (knowledgeId: string, botId: string) => {
    const prisma = getPrisma();
    return await prisma.botKnowledge.findFirst({
      where: { id: knowledgeId, botId },
    });
  },

  deleteKnowledge: async (knowledgeId: string) => {
    const prisma = getPrisma();
    return await prisma.botKnowledge.delete({
      where: { id: knowledgeId },
    });
  },

  // ==========================================
  // TRAINING
  // ==========================================

  hasActiveTraining: async (botId: string): Promise<boolean> => {
    const prisma = getPrisma();
    const active = await prisma.botTraining.findFirst({
      where: { botId, status: { in: ['QUEUED', 'PROCESSING'] } },
    });
    return !!active;
  },

  triggerTraining: async (botId: string, capabilityId?: string) => {
    const prisma = getPrisma();

    // Create training record (QUEUED)
    const training = await prisma.botTraining.create({
      data: {
        botId,
        capabilityId: capabilityId ?? null,
        status: 'QUEUED',
        progress: 0,
        triggeredBy: 'USER',
      },
    });

    const queue = getQueue('training');
    await queue.add('train-bot', { trainingId: training.id, botId, capabilityId: capabilityId ?? null });

    return training;
  },

  getTrainings: async (botId: string, query: TrainingListQuery) => {
    const prisma = getPrisma();
    return await prisma.botTraining.findMany({
      where: {
        botId,
        ...(query.capabilityId ? { capabilityId: query.capabilityId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
    });
  },

  // ==========================================
  // CONFIG & RULES
  // ==========================================

  upsertBotConfig: async (botId: string, data: UpdateBotConfigInput) => {
    const prisma = getPrisma();
    return await prisma.botConfig.upsert({
      where: { botId },
      create: { botId, ...data },
      update: data,
    });
  },

  upsertBotRules: async (botId: string, data: UpdateBotRulesInput) => {
    const prisma = getPrisma();
    return await prisma.botRules.upsert({
      where: { botId },
      create: { botId, ...data },
      update: data,
    });
  },
};
