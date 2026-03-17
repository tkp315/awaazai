import { create } from 'zustand';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';
import * as messageService from './message.service';
import { isLimitReached } from '@/modules/subscription';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import type {
  IChat, ISession, IMessage,
  TranscribingPayload, TextChunkPayload,
  AudioChunkPayload, MessageSavedPayload,
} from './message.types';

interface MessageState {
  // Chats
  chats: IChat[];
  loadingChats: boolean;

  // Active session
  activeChat: IChat | null;
  activeSession: ISession | null;
  messages: IMessage[];
  loadingMessages: boolean;

  // Live state
  isProcessing: boolean;       // pipeline chal rahi hai
  isRecording: boolean;        // user record kar raha hai
  currentTranscription: string; // user ki awaaz ka text
  currentAiText: string;       // AI ka live text
  aiSpeaking: boolean;         // AI bol raha hai

  // Actions
  fetchChats: () => Promise<void>;
  createChat: (botVoiceId: string, name?: string) => Promise<IChat | null>;
  openChat: (chatId: string) => Promise<void>;
  startSession: (chatId: string) => Promise<void>;
  endSession: (feedback?: { rating?: number; comment?: string }) => Promise<void>;
  fetchMessages: (chatId: string, sessionId: string) => Promise<void>;
  sendVoice: (audioUri: string) => Promise<void>;
  interrupt: () => void;
  deleteChat: (chatId: string) => Promise<void>;
  cleanup: () => void;
  limitReached: boolean;
  clearLimitReached: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  chats: [],
  loadingChats: false,
  activeChat: null,
  activeSession: null,
  messages: [],
  loadingMessages: false,
  isProcessing: false,
  isRecording: false,
  currentTranscription: '',
  currentAiText: '',
  aiSpeaking: false,
  limitReached: false,

  createChat: async (botVoiceId, name) => {
    set({ limitReached: false });
    try {
      const chat = await messageService.createChat(botVoiceId, name);
      set(state => ({ chats: [chat, ...state.chats] }));
      return chat;
    } catch (e) {
      if (isLimitReached(e)) {
        set({ limitReached: true });
      } else {
        console.error('createChat', e);
      }
      return null;
    }
  },

  fetchChats: async () => {
    set({ loadingChats: true });
    try {
      const chats = await messageService.getAllChats();
      set({ chats });
    } catch (e) {
      console.error('fetchChats', e);
    } finally {
      set({ loadingChats: false });
    }
  },

  openChat: async (chatId) => {
    try {
      const chat = await messageService.getChatById(chatId);
      set({ activeChat: chat });
    } catch (e) {
      console.error('openChat', e);
    }
  },

  startSession: async (chatId) => {
    try {
      const session = await messageService.startSession(chatId);
      set({ activeSession: session, messages: [], currentAiText: '', currentTranscription: '' });

      // Socket connect karo
      const socket = await connectSocket();

      // Room join karo
      socket.emit('join_session', { chatId, sessionId: session.id });

      // ── Socket events ──────────────────────────────────────────

      socket.on('session_joined', () => {
        console.log('Session joined');
      });

      socket.on('pipeline_start', () => {
        set({ isProcessing: true, currentAiText: '', aiSpeaking: false });
      });

      socket.on('transcribing', (payload: TranscribingPayload) => {
        set({ currentTranscription: payload.text });
      });

      socket.on('text_chunk', (payload: TextChunkPayload) => {
        set({ currentAiText: payload.full });
      });

      let currentSound: Audio.Sound | null = null;
      let typewriterTimer: ReturnType<typeof setInterval> | null = null;

      const startTypewriter = (text: string, durationMs: number) => {
        if (typewriterTimer) clearInterval(typewriterTimer);
        set({ currentAiText: '' });
        const words = text.split(' ');
        const intervalMs = Math.max(60, durationMs / words.length);
        let i = 0;
        typewriterTimer = setInterval(() => {
          i++;
          set({ currentAiText: words.slice(0, i).join(' ') });
          if (i >= words.length) {
            clearInterval(typewriterTimer!);
            typewriterTimer = null;
          }
        }, intervalMs);
      };

      socket.on('audio_chunk', () => {
        set({ aiSpeaking: true });
      });

      socket.on('ai_stopped', async (payload?: { audioUrl?: string; aiText?: string }) => {
        set({ aiSpeaking: false, isProcessing: false });

        if (!payload?.audioUrl) return;

        try {
          if (currentSound) {
            await currentSound.unloadAsync().catch(() => {});
            currentSound = null;
          }

          // Audio load karo — duration milte hi typewriter start karo
          const { sound, status } = await Audio.Sound.createAsync(
            { uri: payload.audioUrl },
            { shouldPlay: true },
          );
          currentSound = sound;
          set({ aiSpeaking: true });

          const durationMs = status.isLoaded && status.durationMillis
            ? status.durationMillis
            : 3000;

          if (payload.aiText) startTypewriter(payload.aiText, durationMs);

          sound.setOnPlaybackStatusUpdate((s) => {
            if (s.isLoaded && s.didJustFinish) {
              sound.unloadAsync().catch(() => {});
              currentSound = null;
              set({ aiSpeaking: false, currentAiText: '' });
              if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
            }
          });
        } catch (e) {
          console.error('ai audio play error', e);
          set({ aiSpeaking: false });
        }
      });

      socket.on('message_saved', (payload: MessageSavedPayload) => {
        const userMsg: IMessage = {
          _id: Date.now().toString(),
          chatId,
          chatSession: session.id,
          sentBy: 'user',
          messageContent: payload.userMessage.messageContent,
          messageVoiceUrl: payload.userMessage.messageVoiceUrl,
          status: 'DELIVERED',
          sentAt: new Date().toISOString(),
        };
        const aiMsg: IMessage = {
          _id: (Date.now() + 1).toString(),
          chatId,
          chatSession: session.id,
          sentBy: 'ai',
          messageContent: payload.aiMessage.messageContent,
          messageVoiceUrl: payload.aiMessage.messageVoiceUrl,
          status: 'DELIVERED',
          sentAt: new Date().toISOString(),
        };
        set(state => ({
          messages: [...state.messages, userMsg, aiMsg],
          isProcessing: false,
          aiSpeaking: false,
          currentTranscription: '',
          currentAiText: '',
        }));
      });

      socket.on('error', (payload: { message: string }) => {
        console.error('Socket error:', payload.message);
        set({ isProcessing: false, aiSpeaking: false });
      });

    } catch (e) {
      console.error('startSession', e);
    }
  },

  endSession: async (feedback) => {
    const { activeChat, activeSession } = get();
    if (!activeChat || !activeSession) return;

    try {
      const socket = getSocket();
      socket?.emit('leave_session', {
        chatId: activeChat.id,
        sessionId: activeSession.id,
      });

      await messageService.endSession(activeChat.id, activeSession.id, feedback);
      set({ activeSession: null, messages: [] });
      disconnectSocket();
    } catch (e) {
      console.error('endSession', e);
    }
  },

  fetchMessages: async (chatId, sessionId) => {
    set({ loadingMessages: true });
    try {
      const messages = await messageService.getMessages(chatId, sessionId);
      set({ messages });
    } catch (e) {
      console.error('fetchMessages', e);
    } finally {
      set({ loadingMessages: false });
    }
  },

  sendVoice: async (audioUri) => {
    const { activeChat, activeSession, isProcessing } = get();
    if (!activeChat || !activeSession) {
      console.error('sendVoice: no activeChat or activeSession');
      return;
    }
    if (isProcessing) return;

    const socket = getSocket();
    if (!socket) {
      console.error('sendVoice: socket not initialized');
      return;
    }

    try {
      set({ isProcessing: true, currentTranscription: '', currentAiText: '' });

      const base64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: 'base64',
      });

      socket.emit('send_voice', {
        chatId: activeChat.id,
        sessionId: activeSession.id,
        audioBase64: base64,
        fileName: `voice_${Date.now()}.${audioUri.split('.').pop() ?? 'm4a'}`,
      });
    } catch (e) {
      console.error('sendVoice', e);
      set({ isProcessing: false });
    }
  },

  interrupt: () => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('user_interrupt');
    }
    set({ aiSpeaking: false, isProcessing: false });
  },

  deleteChat: async (chatId) => {
    try {
      await messageService.deleteChat(chatId);
      set(state => ({ chats: state.chats.filter(c => c.id !== chatId) }));
    } catch (e) {
      console.error('deleteChat', e);
    }
  },

  cleanup: () => {
    disconnectSocket();
    set({
      activeChat: null,
      activeSession: null,
      messages: [],
      isProcessing: false,
      isRecording: false,
      currentTranscription: '',
      currentAiText: '',
      aiSpeaking: false,
    });
  },

  clearLimitReached: () => set({ limitReached: false }),
}));
