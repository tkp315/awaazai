import axiosInstance from '@/api/fetch/client';
import { AxiosError } from 'axios';
import type { IChat, ISession, IMessage } from './message.types';

const CHAT_ENDPOINTS = {
  CHATS: 'chats',
  CHAT: (chatId: string) => `chats/${chatId}`,
  SESSIONS: (chatId: string) => `chats/${chatId}/sessions`,
  END_SESSION: (chatId: string, sessionId: string) => `chats/${chatId}/sessions/${sessionId}/end`,
  MESSAGES: (chatId: string, sessionId: string) => `chats/${chatId}/sessions/${sessionId}/messages`,
};

export function handleError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export const getAllChats = async (): Promise<IChat[]> => {
  const res = await axiosInstance.get(CHAT_ENDPOINTS.CHATS);
  return res.data.data;
};

export const getChatById = async (chatId: string): Promise<IChat> => {
  const res = await axiosInstance.get(CHAT_ENDPOINTS.CHAT(chatId));
  return res.data.data;
};

export const createChat = async (botVoiceId: string, name?: string): Promise<IChat> => {
  const res = await axiosInstance.post(CHAT_ENDPOINTS.CHATS, { botVoiceId, name });
  return res.data.data;
};

export const deleteChat = async (chatId: string): Promise<void> => {
  await axiosInstance.delete(CHAT_ENDPOINTS.CHAT(chatId));
};

export const startSession = async (chatId: string): Promise<ISession> => {
  const res = await axiosInstance.post(CHAT_ENDPOINTS.SESSIONS(chatId));
  return res.data.data;
};

export const endSession = async (
  chatId: string,
  sessionId: string,
  feedback?: { rating?: number; comment?: string }
): Promise<ISession> => {
  const res = await axiosInstance.patch(CHAT_ENDPOINTS.END_SESSION(chatId, sessionId), {
    userFeedback: feedback,
  });
  return res.data.data;
};

export const getMessages = async (
  chatId: string,
  sessionId: string,
  limit = 50,
  before?: string
): Promise<IMessage[]> => {
  const res = await axiosInstance.get(CHAT_ENDPOINTS.MESSAGES(chatId, sessionId), {
    params: { limit, before },
  });
  return res.data.data;
};
