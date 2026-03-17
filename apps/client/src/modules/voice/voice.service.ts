import axiosInstance from '@/api/fetch/client';
import { AxiosError } from 'axios';
import type { IBotVoice, ISampleVoice, CreateVoicePayload } from './voice.types';

const VOICE_ENDPOINTS = {
  SAMPLES:          'voices/samples',
  SAMPLES_SESSION:  (sessionId: string) => `voices/samples/${sessionId}`,
  SAMPLE:           (sampleId: string) => `voices/samples/${sampleId}`,
  BOT_VOICES:       (botId: string) => `voices/bots/${botId}`,
  READY_VOICES:     'voices/ready',
  VOICE:            (voiceId: string) => `voices/${voiceId}`,
  RETRY_CLONE:      (voiceId: string) => `voices/${voiceId}/clone`,
};

export function handleError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

// ─── Samples ─────────────────────────────────────────────────────────────────

export const uploadSamples = async (
  sessionId: string,
  files: { uri: string; name: string; type: string }[]
): Promise<ISampleVoice[]> => {
  const form = new FormData();
  form.append('sessionId', sessionId);
  files.forEach(f => form.append('samples', { uri: f.uri, name: f.name, type: f.type } as any));
  const res = await axiosInstance.post(VOICE_ENDPOINTS.SAMPLES, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const getSamplesBySession = async (sessionId: string): Promise<ISampleVoice[]> => {
  const res = await axiosInstance.get(VOICE_ENDPOINTS.SAMPLES_SESSION(sessionId));
  return res.data.data;
};

export const deleteSample = async (sampleId: string): Promise<void> => {
  await axiosInstance.delete(VOICE_ENDPOINTS.SAMPLE(sampleId));
};

// ─── Bot Voices ───────────────────────────────────────────────────────────────

export const getVoicesByBot = async (botId: string): Promise<IBotVoice[]> => {
  const res = await axiosInstance.get(VOICE_ENDPOINTS.BOT_VOICES(botId));
  return res.data.data;
};

export const getAllReadyVoices = async (): Promise<IBotVoice[]> => {
  const res = await axiosInstance.get(VOICE_ENDPOINTS.READY_VOICES);
  return res.data.data;
};

export const createBotVoice = async (
  botId: string,
  payload: CreateVoicePayload
): Promise<IBotVoice> => {
  const res = await axiosInstance.post(VOICE_ENDPOINTS.BOT_VOICES(botId), payload);
  return res.data.data;
};

// ─── Voice ────────────────────────────────────────────────────────────────────

export const getVoiceById = async (voiceId: string): Promise<IBotVoice> => {
  const res = await axiosInstance.get(VOICE_ENDPOINTS.VOICE(voiceId));
  return res.data.data;
};

export const deleteVoice = async (voiceId: string): Promise<void> => {
  await axiosInstance.delete(VOICE_ENDPOINTS.VOICE(voiceId));
};

export const retryCloning = async (voiceId: string): Promise<void> => {
  await axiosInstance.post(VOICE_ENDPOINTS.RETRY_CLONE(voiceId));
};
