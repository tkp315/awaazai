import { create } from 'zustand';
import * as voiceService from './voice.service';
import { isLimitReached } from '@/modules/subscription';
import type { IBotVoice, ISampleVoice, CreateVoicePayload } from './voice.types';

interface VoiceState {
  voices: IBotVoice[];
  readyVoices: IBotVoice[];
  samples: ISampleVoice[];
  loadingVoices: boolean;
  loadingReadyVoices: boolean;
  loadingSamples: boolean;
  isUploading: boolean;
  isCreating: boolean;
  error: string | null;
  limitReached: boolean;

  fetchVoices: (botId: string) => Promise<void>;
  fetchReadyVoices: () => Promise<void>;
  fetchSamples: (sessionId: string) => Promise<void>;
  uploadSamples: (sessionId: string, files: { uri: string; name: string; type: string }[]) => Promise<ISampleVoice[] | null>;
  deleteSample: (sampleId: string) => Promise<void>;
  createVoice: (botId: string, payload: CreateVoicePayload) => Promise<IBotVoice | null>;
  deleteVoice: (voiceId: string) => Promise<void>;
  retryCloning: (voiceId: string) => Promise<void>;
  clearSamples: () => void;
  clearError: () => void;
  clearLimitReached: () => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voices: [],
  readyVoices: [],
  samples: [],
  loadingVoices: false,
  loadingReadyVoices: false,
  loadingSamples: false,
  isUploading: false,
  isCreating: false,
  error: null,
  limitReached: false,

  fetchReadyVoices: async () => {
    set({ loadingReadyVoices: true, error: null });
    try {
      const readyVoices = await voiceService.getAllReadyVoices();
      set({ readyVoices });
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to fetch ready voices') });
    } finally {
      set({ loadingReadyVoices: false });
    }
  },

  fetchVoices: async (botId) => {
    set({ loadingVoices: true, error: null });
    try {
      const voices = await voiceService.getVoicesByBot(botId);
      set({ voices });
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to fetch voices') });
    } finally {
      set({ loadingVoices: false });
    }
  },

  fetchSamples: async (sessionId) => {
    set({ loadingSamples: true, error: null });
    try {
      const samples = await voiceService.getSamplesBySession(sessionId);
      set({ samples });
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to fetch samples') });
    } finally {
      set({ loadingSamples: false });
    }
  },

  uploadSamples: async (sessionId, files) => {
    set({ isUploading: true, error: null });
    try {
      const uploaded = await voiceService.uploadSamples(sessionId, files);
      set(state => ({ samples: [...state.samples, ...uploaded] }));
      return uploaded;
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to upload samples') });
      return null;
    } finally {
      set({ isUploading: false });
    }
  },

  deleteSample: async (sampleId) => {
    try {
      await voiceService.deleteSample(sampleId);
      set(state => ({ samples: state.samples.filter(s => s.id !== sampleId) }));
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to delete sample') });
    }
  },

  createVoice: async (botId, payload) => {
    set({ isCreating: true, error: null, limitReached: false });
    try {
      const voice = await voiceService.createBotVoice(botId, payload);
      set(state => ({ voices: [voice, ...state.voices] }));
      return voice;
    } catch (e) {
      if (isLimitReached(e)) {
        set({ limitReached: true });
      } else {
        set({ error: voiceService.handleError(e, 'Failed to create voice') });
      }
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  deleteVoice: async (voiceId) => {
    try {
      await voiceService.deleteVoice(voiceId);
      set(state => ({ voices: state.voices.filter(v => v.id !== voiceId) }));
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to delete voice') });
    }
  },

  retryCloning: async (voiceId) => {
    try {
      await voiceService.retryCloning(voiceId);
      set(state => ({
        voices: state.voices.map(v =>
          v.id === voiceId ? { ...v, status: 'PENDING' } : v
        ),
      }));
    } catch (e) {
      set({ error: voiceService.handleError(e, 'Failed to retry cloning') });
    }
  },

  clearSamples: () => set({ samples: [] }),
  clearError: () => set({ error: null }),
  clearLimitReached: () => set({ limitReached: false }),
}));
