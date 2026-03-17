import { getPrisma } from '@lib/services/database/prisma/index.js';
import { getClient as getOpenAI } from '@lib/services/ai/openai/client.js';
import { getClient as getQdrantClient } from '@lib/services/ai/qdrant/client.js';
import { generateEmbedding } from '@lib/services/ai/embeddings/client.js';
import { textToSpeech } from '@lib/services/ai/elevenlabs/service.js';
import { uploadFile } from '@lib/services/cloudinary/index.js';
import { getLogger } from '@lib/helper/logger/index.js';
import type {
  CreateBotChatInput,
  SendBotMessageInput,
  BotChatListQuery,
  BotMessageListQuery,
} from '../validators/bot.validation.js';

const COLLECTION_NAME = 'bot_knowledge';
const HISTORY_LIMIT = 12; // last 12 messages for context

// ─── RAG Search ──────────────────────────────────────────────────────────────

async function searchKnowledge(botId: string, query: string): Promise<string> {
  const logger = getLogger();
  try {
    const qdrant = getQdrantClient();
    const queryVector = await generateEmbedding(query);

    const results = await qdrant.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: 5,
      filter: {
        must: [{ key: 'metadata.botId', match: { value: botId } }],
      },
      with_payload: true,
    });

    const context = results
      .map(r => (r.payload as Record<string, unknown>)?.page_content ?? '')
      .filter(Boolean)
      .join('\n\n---\n\n');

    logger.debug('[BOT_CHAT] RAG results', { botId, count: results.length });
    return context;
  } catch (err) {
    logger.warn('[BOT_CHAT] RAG search failed, falling back to AI_ONLY', { err });
    return '';
  }
}

// ─── System Prompt Builder ───────────────────────────────────────────────────

interface BotConfigContext {
  tone: string;
  personality: { traits: string[]; style: string } | null;
  customPrompt: string | null;
  primaryLanguage: string;
  secondaryLanguage: string | null;
  languageMixing: boolean;
  responseLength: string;
  responseFormat: string;
  useEmoji: boolean;
  fallbackMessage: string | null;
}

interface BotRulesContext {
  profanityFilter: boolean;
  blockedWords: string[];
  avoidTopics: string[];
  allowedTopics: string[];
  sensitiveMode: boolean;
  maxResponseLength: number | null;
  doList: string[];
  dontList: string[];
  customInstructions: string | null;
}

function buildSystemPrompt(
  botName: string | null,
  purpose: string | null,
  config: BotConfigContext | null,
  rules: BotRulesContext | null,
  ragContext: string
): string {
  const sections: string[] = [];

  // ── Identity ──
  let identity = `You are ${botName ?? 'an AI assistant'}.`;
  if (purpose) identity += ` Your purpose: ${purpose}.`;
  sections.push(identity);

  // ── Personality ──
  if (config) {
    const tone = config.tone.toLowerCase();
    const lang = config.primaryLanguage ?? 'en';
    const secondaryLang = config.secondaryLanguage;
    const mixing = config.languageMixing;
    const responseLength = config.responseLength ?? 'MEDIUM';
    const responseFormat = config.responseFormat ?? 'TEXT_ONLY';

    let personality = `Tone: ${tone}.`;

    if (config.personality?.traits?.length) {
      personality += `\nPersonality traits: ${config.personality.traits.join(', ')}.`;
    }
    if (config.personality?.style) {
      personality += `\nCommunication style: ${config.personality.style}.`;
    }

    personality += `\nLanguage: ${lang}`;
    if (secondaryLang) personality += ` (secondary: ${secondaryLang})`;
    if (mixing) personality += ' — Hinglish mixing allowed';
    personality += '.';

    const lengthMap: Record<string, string> = {
      SHORT: 'Keep responses brief and to the point (1-3 sentences when possible).',
      MEDIUM: 'Give balanced responses — not too short, not too long.',
      DETAILED: 'Provide thorough, detailed responses with explanations.',
    };
    personality += `\nResponse length: ${lengthMap[responseLength] ?? lengthMap.MEDIUM}`;

    const formatMap: Record<string, string> = {
      TEXT_ONLY: 'Plain text only, no markdown.',
      TEXT_WITH_EMOJI: 'Use emojis naturally to make responses friendly.',
      MARKDOWN: 'Format responses using markdown (bold, lists, headers where helpful).',
      RICH_TEXT: 'Use rich formatting with structure and visual hierarchy.',
    };
    personality += `\nFormat: ${formatMap[responseFormat] ?? formatMap.TEXT_ONLY}`;

    if (!config.useEmoji && responseFormat !== 'TEXT_WITH_EMOJI') {
      personality += '\nDo not use emojis.';
    }

    sections.push(personality);
  }

  // ── Custom prompt ──
  if (config?.customPrompt) {
    sections.push(`Additional instructions:\n${config.customPrompt}`);
  }

  // ── Rules & Safety ──
  if (rules) {
    const ruleLines: string[] = [];

    if (rules.doList?.length) {
      ruleLines.push(`Always do:\n${rules.doList.map(r => `- ${r}`).join('\n')}`);
    }
    if (rules.dontList?.length) {
      ruleLines.push(`Never do:\n${rules.dontList.map(r => `- ${r}`).join('\n')}`);
    }
    if (rules.allowedTopics?.length) {
      ruleLines.push(`Only discuss these topics: ${rules.allowedTopics.join(', ')}.`);
    }
    if (rules.avoidTopics?.length) {
      ruleLines.push(`Avoid these topics: ${rules.avoidTopics.join(', ')}.`);
    }
    if (rules.blockedWords?.length) {
      ruleLines.push(`Never use these words: ${rules.blockedWords.join(', ')}.`);
    }
    if (rules.profanityFilter) {
      ruleLines.push('Filter out profanity. Do not use or repeat offensive language.');
    }
    if (rules.sensitiveMode) {
      ruleLines.push('Handle all topics with extra sensitivity and care.');
    }
    if (rules.maxResponseLength) {
      ruleLines.push(`Keep responses under ${rules.maxResponseLength} characters.`);
    }
    if (rules.customInstructions) {
      ruleLines.push(rules.customInstructions);
    }

    if (ruleLines.length) {
      sections.push(`Rules & Safety:\n${ruleLines.join('\n')}`);
    }
  }

  // ── Fallback ──
  if (config?.fallbackMessage) {
    sections.push(`If you cannot answer, respond with: "${config.fallbackMessage}"`);
  }

  // ── RAG Knowledge ──
  if (ragContext) {
    sections.push(
      `Use the following knowledge to answer accurately:\n\n${ragContext}\n\nIf the answer is not in the knowledge base, use your general knowledge but mention it.`
    );
  }

  return sections.join('\n\n');
}

// ─── Bot Chat CRUD ────────────────────────────────────────────────────────────

export const botChatService = {
  createChat: async (userId: string, botId: string, data: CreateBotChatInput) => {
    const prisma = getPrisma();

    const chat = await prisma.botChat.create({
      data: {
        userId,
        botId,
        title: data.title ?? null,
        sessions: {
          create: { startedAt: new Date() },
        },
      },
      include: {
        sessions: { orderBy: { startedAt: 'desc' }, take: 1 },
      },
    });

    return chat;
  },

  getChats: async (userId: string, botId: string, query: BotChatListQuery) => {
    const prisma = getPrisma();
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      prisma.botChat.findMany({
        where: { userId, botId },
        include: {
          sessions: {
            orderBy: { startedAt: 'desc' },
            take: 1,
            include: {
              messages: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
          },
          _count: { select: { sessions: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.botChat.count({ where: { userId, botId } }),
    ]);

    return { chats, total, page, limit };
  },

  getChatById: async (chatId: string, userId: string) => {
    const prisma = getPrisma();
    return await prisma.botChat.findFirst({
      where: { id: chatId, userId },
      include: {
        sessions: {
          orderBy: { startedAt: 'desc' },
          take: 1,
          include: {
            messages: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    });
  },

  deleteChat: async (chatId: string) => {
    const prisma = getPrisma();
    return await prisma.botChat.delete({ where: { id: chatId } });
  },

  // ─── Session Management ────────────────────────────────────────────────────

  getOrCreateActiveSession: async (chatId: string) => {
    const prisma = getPrisma();

    // Get latest open session
    const existing = await prisma.botSession.findFirst({
      where: { botChatId: chatId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });

    if (existing) return existing;

    // Create new session
    return await prisma.botSession.create({
      data: { botChatId: chatId, startedAt: new Date() },
    });
  },

  endSession: async (chatId: string, userId: string) => {
    const prisma = getPrisma();

    // Verify ownership
    const chat = await prisma.botChat.findFirst({ where: { id: chatId, userId } });
    if (!chat) return null;

    const session = await prisma.botSession.findFirst({
      where: { botChatId: chatId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });

    if (!session) return null;

    return await prisma.botSession.update({
      where: { id: session.id },
      data: { endedAt: new Date() },
    });
  },

  // ─── Messages ─────────────────────────────────────────────────────────────

  getMessages: async (chatId: string, userId: string, query: BotMessageListQuery) => {
    const prisma = getPrisma();

    const chat = await prisma.botChat.findFirst({ where: { id: chatId, userId } });
    if (!chat) return null;

    const session = await prisma.botSession.findFirst({
      where: { botChatId: chatId, endedAt: null },
      orderBy: { startedAt: 'desc' },
    });

    if (!session) return [];

    return await prisma.botMessage.findMany({
      where: { botSessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: query.limit,
    });
  },

  // ─── Send Message ──────────────────────────────────────────────────────────

  sendMessage: async (botId: string, chatId: string, userId: string, data: SendBotMessageInput) => {
    const logger = getLogger();
    const prisma = getPrisma();

    // Get bot with config, rules, and selected voice
    const bot = await prisma.bot.findFirst({
      where: { id: botId, userId },
      include: {
        config: true,
        rules: true,
        selectedVoice: { select: { elvenlabsVoiceId: true } },
      },
    });

    if (!bot) throw new Error('Bot not found');

    // Get or create active session
    const session = await botChatService.getOrCreateActiveSession(chatId);

    // Get recent history for context
    const history = await prisma.botMessage.findMany({
      where: { botSessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: HISTORY_LIMIT,
    });

    // RAG search if needed
    let ragContext = '';
    let ragUsed = false;
    let ragSources: unknown = null;

    if (bot.knowledgeMode === 'RAG' || bot.knowledgeMode === 'HYBRID') {
      ragContext = await searchKnowledge(botId, data.content);
      ragUsed = !!ragContext;
      if (ragUsed) ragSources = { searched: true };
    }

    // Build messages for OpenAI
    const systemPrompt = buildSystemPrompt(
      bot.name,
      bot.purpose,
      bot.config as BotConfigContext | null,
      bot.rules as BotRulesContext | null,
      ragContext
    );

    const historyMessages = history.map(msg => ({
      role: msg.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: msg.content,
    }));

    // Call OpenAI
    const openai = getOpenAI();
    logger.info('[BOT_CHAT] Calling OpenAI', { botId, chatId, knowledgeMode: bot.knowledgeMode });

    // Rough token estimate: 1 token ≈ 4 chars
    const maxResponseLength = (bot as any).rules?.maxResponseLength;
    const maxTokens = maxResponseLength ? Math.min(Math.ceil(maxResponseLength / 4), 2000) : 1000;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: data.content },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const aiReply =
      completion.choices[0]?.message?.content?.trim() ?? 'Sorry, I could not respond.';

    // Generate TTS if bot has a selected voice
    let voiceUrl: string | null = null;
    const elvenlabsVoiceId = (bot as any).selectedVoice?.elvenlabsVoiceId;
    if (elvenlabsVoiceId) {
      try {
        const audioBuffer = await textToSpeech(elvenlabsVoiceId, aiReply);
        const uploaded = await uploadFile(audioBuffer, 'bot-chat-audio', 'audio');
        voiceUrl = uploaded.url;
        logger.info('[BOT_CHAT] TTS generated', { botId, voiceUrl });
      } catch (ttsErr) {
        logger.warn('[BOT_CHAT] TTS failed, saving message without voice', { ttsErr });
      }
    }

    // Save both messages in a transaction
    const [userMessage, botMessage] = await prisma.$transaction([
      prisma.botMessage.create({
        data: {
          botSessionId: session.id,
          role: 'USER',
          content: data.content,
        },
      }),
      prisma.botMessage.create({
        data: {
          botSessionId: session.id,
          role: 'BOT',
          content: aiReply,
          ragUsed,
          ragSources: ragSources as object | undefined,
          voiceUrl,
        },
      }),
    ]);

    // Update chat updatedAt
    await prisma.botChat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    logger.info('[BOT_CHAT] Message sent', { botId, chatId, ragUsed });

    return { userMessage, botMessage, sessionId: session.id };
  },
};
