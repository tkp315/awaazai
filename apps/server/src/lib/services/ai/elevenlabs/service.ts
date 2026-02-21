import { getClient, getConfig } from './client.js';
import type { Readable } from 'stream';

// ============================================
// TEXT-TO-SPEECH
// ============================================

export interface TTSOptions {
  stability?: number;
  similarityBoost?: number;
  style?: number;
  modelId?: string;
}

export async function textToSpeech(
  voiceId: string,
  text: string,
  options?: TTSOptions
): Promise<Buffer> {
  const client = getClient();
  const config = getConfig();

  const audio = await client.textToSpeech.convert(voiceId, {
    text,
    model_id: options?.modelId || config.tts.modelId,
    voice_settings: {
      stability: options?.stability ?? config.tts.stability,
      similarity_boost: options?.similarityBoost ?? config.tts.similarityBoost,
      style: options?.style ?? config.tts.style,
    },
  });

  // Convert the stream to buffer
  const chunks: Buffer[] = [];
  for await (const chunk of audio) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function* textToSpeechStream(
  voiceId: string,
  text: string,
  options?: TTSOptions
): AsyncGenerator<Buffer> {
  const client = getClient();
  const config = getConfig();

  const audio = await client.textToSpeech.convertAsStream(voiceId, {
    text,
    model_id: options?.modelId || config.tts.modelId,
    voice_settings: {
      stability: options?.stability ?? config.tts.stability,
      similarity_boost: options?.similarityBoost ?? config.tts.similarityBoost,
      style: options?.style ?? config.tts.style,
    },
  });

  for await (const chunk of audio) {
    yield Buffer.from(chunk);
  }
}

export interface VoiceCloneOptions {
  name: string;
  description?: string;
  labels?: Record<string, string>;
}

export async function cloneVoice(
  files: Buffer[],
  options: VoiceCloneOptions
): Promise<{ voiceId: string }> {
  const client = getClient();

  // Convert buffers to File objects
  const audioFiles = files.map(
    (buffer: any, index) => new File([buffer], `sample_${index}.mp3`, { type: 'audio/mpeg' })
  );

  const voice = await client.voices.add({
    name: options.name,
    description: options.description,
    // labels: options.labels||undefined,
    files: audioFiles,
  });

  return {
    voiceId: voice.voice_id,
    // name: voice.name,
  };
}

export async function deleteVoice(voiceId: string): Promise<void> {
  const client = getClient();
  await client.voices.delete(voiceId);
}

// ============================================
// VOICE MANAGEMENT
// ============================================

export interface VoiceInfo {
  voiceId: string;
  name?: string;
  description?: string;
  labels?: Record<string, string>;
  previewUrl?: string;
}

export async function getVoice(voiceId: string): Promise<VoiceInfo> {
  const client = getClient();
  const voice = await client.voices.get(voiceId);

  return {
    voiceId: voice.voice_id,
    // name: voice.name,
    description: voice.description,
    labels: voice.labels,
    previewUrl: voice.preview_url,
  };
}

export async function getAllVoices(): Promise<VoiceInfo[]> {
  const client = getClient();
  const response = await client.voices.getAll();

  return response.voices.map(voice => ({
    voiceId: voice.voice_id,
    name: voice.name,
    description: voice.description,
    labels: voice.labels,
    previewUrl: voice.preview_url,
  }));
}

// export async function editVoice(
//   voiceId: string,
//   options: {
//     name?: string;
//     description?: string;
//     labels?: Record<string, string>;
//   }
// ): Promise<void> {
//   const client = getClient();

//   await client.voices.edit(voiceId, {
//     name: options.name,
//     description: options.description,
//     labels: options.labels,
//   });
// }

// ============================================
// VOICE SETTINGS
// ============================================

export async function getVoiceSettings(voiceId: string): Promise<{
  // stability: number;
  // similarityBoost: number;
  style: number;
}> {
  const client = getClient();
  const settings = await client.voices.getSettings(voiceId);

  return {
    // stability: settings.stability,
    // similarityBoost: settings.similarity_boost,
    style: settings.style || 0,
  };
}

// ============================================
// USER INFO
// ============================================

export async function getUserInfo(): Promise<{
  characterCount: number;
  characterLimit: number;
  voiceCount?: number;
  voiceLimit: number;
}> {
  const client = getClient();
  const user = await client.user.get();
  const subscription = user.subscription;

  return {
    characterCount: subscription.character_count,
    characterLimit: subscription.character_limit,
    // voiceCount: subscription.voice_count || 0,
    voiceLimit: subscription.voice_limit || 0,
  };
}

// ============================================
// VALIDATION
// ============================================

export function validateSampleDuration(durationSeconds: number): {
  valid: boolean;
  error?: string;
} {
  const config = getConfig();

  if (durationSeconds < config.voiceClone.minSampleDuration) {
    return {
      valid: false,
      error: `Sample must be at least ${config.voiceClone.minSampleDuration} seconds`,
    };
  }

  if (durationSeconds > config.voiceClone.maxSampleDuration) {
    return {
      valid: false,
      error: `Sample must not exceed ${config.voiceClone.maxSampleDuration} seconds`,
    };
  }

  return { valid: true };
}

export function validateSampleCount(count: number): {
  valid: boolean;
  error?: string;
} {
  const config = getConfig();

  if (count > config.voiceClone.maxSamples) {
    return {
      valid: false,
      error: `Maximum ${config.voiceClone.maxSamples} samples allowed`,
    };
  }

  return { valid: true };
}
