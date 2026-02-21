import { ElevenLabsClient } from 'elevenlabs';
import { getLogger } from '../../../helper/logger/index.js';
import type { ElevenLabsConfig } from '../../../../config/services/ai/elevenlabs/index.js';

let elevenLabsClient: ElevenLabsClient | null = null;
let elevenLabsConfig: ElevenLabsConfig | null = null;

export async function createClient(config: ElevenLabsConfig): Promise<ElevenLabsClient> {
  const logger = getLogger();

  elevenLabsClient = new ElevenLabsClient({
    apiKey: config.apiKey,
  });

  elevenLabsConfig = config;

  logger.info('✅ ElevenLabs client initialized', { modelId: config.tts.modelId });

  return elevenLabsClient;
}

export function getClient(): ElevenLabsClient {
  if (!elevenLabsClient) {
    throw new Error('ElevenLabs client not initialized');
  }
  return elevenLabsClient;
}

export function getConfig(): ElevenLabsConfig {
  if (!elevenLabsConfig) {
    throw new Error('ElevenLabs config not initialized');
  }
  return elevenLabsConfig;
}

export async function disconnect(): Promise<void> {
  const logger = getLogger();
  elevenLabsClient = null;
  elevenLabsConfig = null;
  logger.info('ElevenLabs client disconnected');
}
