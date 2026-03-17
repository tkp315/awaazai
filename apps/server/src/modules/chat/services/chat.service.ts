import { getPrisma } from '@lib/services/database/prisma/index.js';
import { MessageModel } from '../../message/models/message.model.js';
import type { CreateChatInput, EndSessionInput } from '../validators/chat.validation.js';

const chatInclude = {
  botVoice: {
    select: {
      id: true,
      voiceName: true,
      relation: true,
      status: true,
      language: true,
      generatedVoiceSample: true,
      bot: {
        select: { id: true, name: true, avatar: true },
      },
    },
  },
};

export const chatService = {
  // ─── Chat ─────────────────────────────────────────────────────────────────

  createChat: async (userId: string, input: CreateChatInput) => {
    const prisma = getPrisma();

    // Verify botVoice belongs to user and is READY
    const botVoice = await prisma.botVoice.findUnique({
      where: { id: input.botVoiceId },
      include: { bot: { select: { userId: true } } },
    });

    if (!botVoice) throw new Error('BotVoice not found');
    if (botVoice.bot.userId !== userId) throw new Error('Unauthorized');
    if (botVoice.status !== 'READY') throw new Error('Voice is not ready for chat yet');

    // Check if chat already exists for this botVoice (1:1)
    const existing = await prisma.chat.findUnique({
      where: { botVoiceId: input.botVoiceId },
    });
    if (existing) throw new Error('Chat already exists for this voice');

    return prisma.chat.create({
      data: {
        botVoiceId: input.botVoiceId,
        name: input.name ?? botVoice.voiceName ?? 'Chat',
        UsedFor: input.usedFor,
      },
      include: chatInclude,
    });
  },

  getAllChats: async (userId: string) => {
    const prisma = getPrisma();

    return prisma.chat.findMany({
      where: {
        botVoice: {
          bot: { userId },
        },
      },
      include: {
        ...chatInclude,
        chatSession: {
          orderBy: { startedAt: 'desc' },
          take: 1,
          select: {
            id: true,
            startedAt: true,
            endedAt: true,
          },
        },
        _count: { select: { chatSession: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  },

  getChatById: async (chatId: string, userId: string) => {
    const prisma = getPrisma();

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        ...chatInclude,
        chatSession: {
          orderBy: { startedAt: 'desc' },
          select: {
            id: true,
            startedAt: true,
            endedAt: true,
            userFeedback: true,
            messages: true,
          },
        },
        _count: { select: { chatSession: true } },
      },
    });

    if (!chat) return null;
    if (chat.botVoice.bot.id) {
      const bot = await prisma.bot.findUnique({
        where: { id: chat.botVoice.bot.id },
        select: { userId: true },
      });
      if (bot?.userId !== userId) throw new Error('Unauthorized');
    }

    return chat;
  },

  deleteChat: async (chatId: string, userId: string) => {
    const prisma = getPrisma();

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        botVoice: { include: { bot: { select: { userId: true } } } },
        chatSession: { select: { id: true } },
      },
    });

    if (!chat) throw new Error('Chat not found');
    if (chat.botVoice.bot.userId !== userId) throw new Error('Unauthorized');

    // Delete all MongoDB messages for this chat
    await MessageModel.deleteMany({ chatId });

    // Cascade delete handled by Prisma (Session → Chat)
    await prisma.chat.delete({ where: { id: chatId } });
  },

  // ─── Session ──────────────────────────────────────────────────────────────

  startSession: async (chatId: string, userId: string) => {
    const prisma = getPrisma();

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { botVoice: { include: { bot: { select: { userId: true } } } } },
    });

    if (!chat) throw new Error('Chat not found');
    if (chat.botVoice.bot.userId !== userId) throw new Error('Unauthorized');

    return prisma.session.create({
      data: { chatId },
    });
  },

  endSession: async (chatId: string, sessionId: string, userId: string, input: EndSessionInput) => {
    const prisma = getPrisma();

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        chat: {
          include: { botVoice: { include: { bot: { select: { userId: true } } } } },
        },
      },
    });

    if (!session) throw new Error('Session not found');
    if (session.chatId !== chatId) throw new Error('Session does not belong to this chat');
    if (session.chat.botVoice.bot.userId !== userId) throw new Error('Unauthorized');
    if (session.endedAt) throw new Error('Session already ended');

    return prisma.session.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        userFeedback: input.userFeedback ?? undefined,
      },
    });
  },

  getSessionMessages: async (
    chatId: string,
    sessionId: string,
    userId: string,
    limit = 50,
    before?: string // MongoDB _id for pagination
  ) => {
    const prisma = getPrisma();

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        chat: {
          include: { botVoice: { include: { bot: { select: { userId: true } } } } },
        },
      },
    });

    if (!session) throw new Error('Session not found');
    if (session.chatId !== chatId) throw new Error('Session does not belong to this chat');
    if (session.chat.botVoice.bot.userId !== userId) throw new Error('Unauthorized');

    const query: Record<string, unknown> = { chatId, chatSession: sessionId };
    if (before) {
      query['_id'] = { $lt: before };
    }

    const messages = await MessageModel.find(query).sort({ sentAt: -1 }).limit(limit).lean();

    return messages.reverse(); // chronological order
  },
};
