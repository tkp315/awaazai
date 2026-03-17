import axiosInstance from '@/api/fetch/client';
import { AxiosError } from 'axios';
import type {
  IAvailableBot,
  IBot,
  IBotChat,
  IBotConfig,
  IBotKnowledge,
  IBotMessage,
  IBotTraining,
  IBotVoice,
  CreateBotPayload,
  AddKnowledgePayload,
  CreateBotChatPayload,
  SendBotMessageResponse,
} from './bots.types';

const BOTS_ENDPOINTS = {
  AVAILABLE_BOTS: 'bots/available-bots',
  BOTS: 'bots',
  BOT: (id: string) => `bots/${id}`,
  KNOWLEDGE: (botId: string) => `bots/${botId}/knowledge`,
  KNOWLEDGE_ITEM: (botId: string, knowledgeId: string) => `bots/${botId}/knowledge/${knowledgeId}`,
  TRAIN: (botId: string) => `bots/${botId}/train`,
  TRAININGS: (botId: string) => `bots/${botId}/trainings`,
  CHATS: (botId: string) => `bots/${botId}/chats`,
  CHAT: (botId: string, chatId: string) => `bots/${botId}/chats/${chatId}`,
  CHAT_END: (botId: string, chatId: string) => `bots/${botId}/chats/${chatId}/end`,
  CHAT_MESSAGE: (botId: string, chatId: string) => `bots/${botId}/chats/${chatId}/message`,
  CHAT_MESSAGES: (botId: string, chatId: string) => `bots/${botId}/chats/${chatId}/messages`,
};

function handleError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

// ─── Available Bots ──────────────────────────────────────────────────────────

export const getAvailableBots = async (): Promise<IAvailableBot[]> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.AVAILABLE_BOTS);
  return res.data.data;
};

// ─── Bot CRUD ────────────────────────────────────────────────────────────────

export const getBots = async (): Promise<IBot[]> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.BOTS);
  return res.data.data.bots;
};

export const getBotById = async (botId: string): Promise<IBot> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.BOT(botId));
  return res.data.data;
};

export const updateBotConfig = async (
  botId: string,
  config: Partial<IBotConfig>
): Promise<IBotConfig> => {
  const res = await axiosInstance.patch(`bots/${botId}/config`, config);
  return res.data.data;
};

export const createBot = async (payload: CreateBotPayload): Promise<IBot> => {
  const res = await axiosInstance.post(BOTS_ENDPOINTS.BOTS, payload);
  return res.data.data;
};

export const deleteBot = async (botId: string): Promise<void> => {
  await axiosInstance.delete(BOTS_ENDPOINTS.BOT(botId));
};

// ─── Knowledge ───────────────────────────────────────────────────────────────

export const getKnowledge = async (botId: string): Promise<IBotKnowledge[]> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.KNOWLEDGE(botId));
  return res.data.data;
};

export const addKnowledge = async (
  botId: string,
  payload: AddKnowledgePayload
): Promise<IBotKnowledge> => {
  const res = await axiosInstance.post(BOTS_ENDPOINTS.KNOWLEDGE(botId), payload);
  return res.data.data;
};

export const deleteKnowledge = async (botId: string, knowledgeId: string): Promise<void> => {
  await axiosInstance.delete(BOTS_ENDPOINTS.KNOWLEDGE_ITEM(botId, knowledgeId));
};

// ─── Training ────────────────────────────────────────────────────────────────

export const getTrainings = async (botId: string): Promise<IBotTraining[]> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.TRAININGS(botId));
  return res.data.data;
};

export const triggerTraining = async (
  botId: string,
  capabilityId?: string
): Promise<IBotTraining> => {
  const res = await axiosInstance.post(BOTS_ENDPOINTS.TRAIN(botId), { capabilityId });
  return res.data.data;
};

// ─── AwaazBot Voices ──────────────────────────────────────────────────────────

// Fetch READY voices from the user's AwaazBot instance
export const getAwaazBotVoices = async (awaazBotAvailableId: string): Promise<IBotVoice[]> => {
  try {
    // Get user's bots filtered by AwaazBot template
    const res = await axiosInstance.get(BOTS_ENDPOINTS.BOTS, {
      params: { availableBotId: awaazBotAvailableId, limit: 1 },
    });
    const bots: IBot[] = res.data.data.bots ?? [];
    if (!bots.length) return [];
    // Return botVoices from the first AwaazBot instance
    return bots[0].botVoices ?? [];
  } catch {
    return [];
  }
};

// ─── Bot Chats ────────────────────────────────────────────────────────────────

export const createBotChat = async (
  botId: string,
  payload?: CreateBotChatPayload
): Promise<IBotChat> => {
  const res = await axiosInstance.post(BOTS_ENDPOINTS.CHATS(botId), payload ?? {});
  return res.data.data;
};

export const getBotChats = async (botId: string): Promise<IBotChat[]> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.CHATS(botId));
  return res.data.data.chats;
};

export const getBotChatById = async (botId: string, chatId: string): Promise<IBotChat> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.CHAT(botId, chatId));
  return res.data.data;
};

export const deleteBotChat = async (botId: string, chatId: string): Promise<void> => {
  await axiosInstance.delete(BOTS_ENDPOINTS.CHAT(botId, chatId));
};

export const endBotSession = async (botId: string, chatId: string): Promise<void> => {
  await axiosInstance.post(BOTS_ENDPOINTS.CHAT_END(botId, chatId));
};

export const sendBotMessage = async (
  botId: string,
  chatId: string,
  content: string
): Promise<SendBotMessageResponse> => {
  const res = await axiosInstance.post(BOTS_ENDPOINTS.CHAT_MESSAGE(botId, chatId), { content });
  return res.data.data;
};

export const getBotMessages = async (botId: string, chatId: string): Promise<IBotMessage[]> => {
  const res = await axiosInstance.get(BOTS_ENDPOINTS.CHAT_MESSAGES(botId, chatId));
  return res.data.data;
};
