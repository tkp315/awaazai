import OpenAI from 'openai';
import { getLogger } from '../../../helper/logger/index.js';
import type { OpenAIConfig } from '../../../../config/services/ai/openai/index.js';

let openaiClient: OpenAI | null = null;
let openaiConfig: OpenAIConfig | null = null;

export async function createClient(config: OpenAIConfig): Promise<OpenAI> {
  const logger = getLogger();

  openaiClient = new OpenAI({
    apiKey: config.apiKey,
  });

  openaiConfig = config;

  logger.info('✅ OpenAI client initialized', { chatModel: config.chat.model });

  return openaiClient;
}

export function getClient(): OpenAI {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }
  return openaiClient;
}

export function getConfig(): OpenAIConfig {
  if (!openaiConfig) {
    throw new Error('OpenAI config not initialized');
  }
  return openaiConfig;
}

export async function disconnect(): Promise<void> {
  const logger = getLogger();
  openaiClient = null;
  openaiConfig = null;
  logger.info('OpenAI client disconnected');
}
