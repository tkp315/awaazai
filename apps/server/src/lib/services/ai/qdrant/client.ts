import { QdrantClient } from '@qdrant/qdrant-js';
import { getLogger } from '../../../helper/logger/index.js';
import type { QdrantConfig } from '../../../../config/services/ai/qdrant/index.js';

let qdrantClient: QdrantClient | null = null;
let qdrantConfig: QdrantConfig | null = null;

export async function createClient(config: QdrantConfig): Promise<QdrantClient> {
  const logger = getLogger();

  // Qdrant Cloud needs port 6333 explicitly
  const url = config.endpoint.includes(':') && !config.endpoint.endsWith(':6333')
    ? config.endpoint
    : `${config.endpoint.replace(/\/$/, '')}:6333`;

  qdrantClient = new QdrantClient({
    url,
    apiKey: config.apiKey,
    checkCompatibility: false,
  });

  qdrantConfig = config;

  // Verify connection — non-fatal so server still starts if Qdrant is unreachable
  try {
    await qdrantClient.getCollections();
    logger.info('✅ Qdrant client initialized', { url });
  } catch (err) {
    logger.warn('⚠️ Qdrant connection check failed — will retry on first use', { url, error: err });
  }

  return qdrantClient;
}

export function getClient(): QdrantClient {
  if (!qdrantClient) {
    throw new Error('Qdrant client not initialized');
  }
  return qdrantClient;
}

export function getConfig(): QdrantConfig {
  if (!qdrantConfig) {
    throw new Error('Qdrant config not initialized');
  }
  return qdrantConfig;
}

export async function disconnect(): Promise<void> {
  const logger = getLogger();
  qdrantClient = null;
  qdrantConfig = null;
  logger.info('Qdrant client disconnected');
}
