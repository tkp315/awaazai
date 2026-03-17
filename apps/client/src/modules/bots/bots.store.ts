import { create } from 'zustand';
import * as botsService from './bots.service';
import { isLimitReached } from '@/modules/subscription';
import type {
  IAvailableBot,
  IBot,
  IBotChat,
  IBotConfig,
  IBotKnowledge,
  IBotMessage,
  IBotTraining,
  CreateBotPayload,
  AddKnowledgePayload,
  CreateBotChatPayload,
  SendBotMessageResponse,
} from './bots.types';

interface BotsState {
  // Data
  availableBots: IAvailableBot[];
  bots: IBot[];
  activeBot: IBot | null;
  knowledge: IBotKnowledge[];
  trainings: IBotTraining[];

  // Chat Data
  botChats: IBotChat[];
  activeChat: IBotChat | null;
  activeMessages: IBotMessage[];
  activeSessionId: string | null;

  // Loading
  loadingBots: boolean;
  loadingAvailable: boolean;
  loadingBot: boolean;
  loadingKnowledge: boolean;
  loadingTrainings: boolean;
  loadingChats: boolean;
  loadingMessages: boolean;
  isCreating: boolean;
  isAdding: boolean;
  isTraining: boolean;
  isSavingConfig: boolean;
  isSendingMessage: boolean;

  // Error
  error: string | null;
  limitReached: boolean;

  // Bot Actions
  fetchAvailableBots: () => Promise<void>;
  fetchBots: () => Promise<void>;
  fetchBotById: (botId: string) => Promise<void>;
  fetchKnowledge: (botId: string) => Promise<void>;
  fetchTrainings: (botId: string) => Promise<void>;
  createBot: (payload: CreateBotPayload) => Promise<IBot | null>;
  deleteBot: (botId: string) => Promise<void>;
  addKnowledge: (botId: string, payload: AddKnowledgePayload) => Promise<IBotKnowledge | null>;
  deleteKnowledge: (botId: string, knowledgeId: string) => Promise<void>;
  triggerTraining: (botId: string, capabilityId?: string) => Promise<IBotTraining | null>;
  updateBotConfig: (botId: string, config: Partial<IBotConfig>) => Promise<IBotConfig | null>;

  // Chat Actions
  fetchBotChats: (botId: string) => Promise<void>;
  createBotChat: (botId: string, payload?: CreateBotChatPayload) => Promise<IBotChat | null>;
  openBotChat: (botId: string, chatId: string) => Promise<void>;
  deleteBotChat: (botId: string, chatId: string) => Promise<void>;
  sendBotMessage: (botId: string, chatId: string, content: string) => Promise<SendBotMessageResponse | null>;
  fetchBotMessages: (botId: string, chatId: string) => Promise<void>;
  endBotSession: (botId: string, chatId: string) => Promise<void>;
  setActiveChat: (chat: IBotChat | null) => void;
  clearChatState: () => void;

  clearError: () => void;
  clearLimitReached: () => void;
}

export const useBotsStore = create<BotsState>((set, get) => ({
  availableBots: [],
  bots: [],
  activeBot: null,
  knowledge: [],
  trainings: [],
  botChats: [],
  activeChat: null,
  activeMessages: [],
  activeSessionId: null,
  loadingBots: false,
  loadingAvailable: false,
  loadingBot: false,
  loadingKnowledge: false,
  loadingTrainings: false,
  loadingChats: false,
  loadingMessages: false,
  isCreating: false,
  isAdding: false,
  isTraining: false,
  isSavingConfig: false,
  isSendingMessage: false,
  error: null,
  limitReached: false,

  fetchAvailableBots: async () => {
    set({ loadingAvailable: true, error: null });
    try {
      const availableBots = await botsService.getAvailableBots();
      set({ availableBots });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch available bots' });
    } finally {
      set({ loadingAvailable: false });
    }
  },

  fetchBots: async () => {
    set({ loadingBots: true, error: null });
    try {
      const bots = await botsService.getBots();
      set({ bots });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch bots' });
    } finally {
      set({ loadingBots: false });
    }
  },

  fetchBotById: async (botId) => {
    set({ loadingBot: true, error: null });
    try {
      const bot = await botsService.getBotById(botId);
      set({ activeBot: bot });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch bot' });
    } finally {
      set({ loadingBot: false });
    }
  },

  fetchKnowledge: async (botId) => {
    set({ loadingKnowledge: true, error: null });
    try {
      const knowledge = await botsService.getKnowledge(botId);
      set({ knowledge });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch knowledge' });
    } finally {
      set({ loadingKnowledge: false });
    }
  },

  fetchTrainings: async (botId) => {
    set({ loadingTrainings: true, error: null });
    try {
      const trainings = await botsService.getTrainings(botId);
      set({ trainings });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch trainings' });
    } finally {
      set({ loadingTrainings: false });
    }
  },

  createBot: async (payload) => {
    set({ isCreating: true, error: null, limitReached: false });
    try {
      const bot = await botsService.createBot(payload);
      set(state => ({ bots: [bot, ...state.bots] }));
      return bot;
    } catch (e: unknown) {
      if (isLimitReached(e)) {
        set({ limitReached: true });
      } else {
        set({ error: e instanceof Error ? e.message : 'Failed to create bot' });
      }
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  deleteBot: async (botId) => {
    try {
      await botsService.deleteBot(botId);
      set(state => ({ bots: state.bots.filter(b => b.id !== botId) }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to delete bot' });
    }
  },

  addKnowledge: async (botId, payload) => {
    set({ isAdding: true, error: null });
    try {
      const item = await botsService.addKnowledge(botId, payload);
      set(state => ({ knowledge: [item, ...state.knowledge] }));
      return item;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to add knowledge' });
      return null;
    } finally {
      set({ isAdding: false });
    }
  },

  deleteKnowledge: async (botId, knowledgeId) => {
    try {
      await botsService.deleteKnowledge(botId, knowledgeId);
      set(state => ({ knowledge: state.knowledge.filter(k => k.id !== knowledgeId) }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to delete knowledge' });
    }
  },

  triggerTraining: async (botId, capabilityId) => {
    set({ isTraining: true, error: null });
    try {
      const training = await botsService.triggerTraining(botId, capabilityId);
      set(state => ({ trainings: [training, ...state.trainings] }));
      return training;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to start training' });
      return null;
    } finally {
      set({ isTraining: false });
    }
  },

  updateBotConfig: async (botId, config) => {
    set({ isSavingConfig: true, error: null });
    try {
      const updated = await botsService.updateBotConfig(botId, config);
      set(state => ({
        activeBot: state.activeBot ? { ...state.activeBot, config: updated } : state.activeBot,
      }));
      return updated;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to save settings' });
      return null;
    } finally {
      set({ isSavingConfig: false });
    }
  },

  // ─── Chat Actions ────────────────────────────────────────────────────────────

  fetchBotChats: async (botId) => {
    set({ loadingChats: true, error: null });
    try {
      const chats = await botsService.getBotChats(botId);
      set({ botChats: chats });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch chats' });
    } finally {
      set({ loadingChats: false });
    }
  },

  createBotChat: async (botId, payload) => {
    set({ isCreating: true, error: null });
    try {
      const chat = await botsService.createBotChat(botId, payload);
      set(state => ({ botChats: [chat, ...state.botChats] }));
      return chat;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to create chat' });
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  openBotChat: async (botId, chatId) => {
    set({ loadingMessages: true, error: null });
    try {
      const [chat, messages] = await Promise.all([
        botsService.getBotChatById(botId, chatId),
        botsService.getBotMessages(botId, chatId),
      ]);
      const sessionId = chat.sessions?.[0]?.id ?? null;
      set({ activeChat: chat, activeMessages: messages, activeSessionId: sessionId });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to open chat' });
    } finally {
      set({ loadingMessages: false });
    }
  },

  deleteBotChat: async (botId, chatId) => {
    try {
      await botsService.deleteBotChat(botId, chatId);
      set(state => ({ botChats: state.botChats.filter(c => c.id !== chatId) }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to delete chat' });
    }
  },

  sendBotMessage: async (botId, chatId, content) => {
    set({ isSendingMessage: true, error: null });
    try {
      const result = await botsService.sendBotMessage(botId, chatId, content);
      set(state => ({
        activeMessages: [...state.activeMessages, result.userMessage, result.botMessage],
        activeSessionId: result.sessionId,
      }));
      return result;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to send message' });
      return null;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  fetchBotMessages: async (botId, chatId) => {
    set({ loadingMessages: true, error: null });
    try {
      const messages = await botsService.getBotMessages(botId, chatId);
      set({ activeMessages: messages });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to fetch messages' });
    } finally {
      set({ loadingMessages: false });
    }
  },

  endBotSession: async (botId, chatId) => {
    try {
      await botsService.endBotSession(botId, chatId);
      set({ activeSessionId: null });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Failed to end session' });
    }
  },

  setActiveChat: (chat) => set({ activeChat: chat }),

  clearChatState: () => set({
    activeChat: null,
    activeMessages: [],
    activeSessionId: null,
  }),

  clearError: () => set({ error: null }),
  clearLimitReached: () => set({ limitReached: false }),
}));
