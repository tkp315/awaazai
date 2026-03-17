import { createClient, getClient, getConfig, disconnect } from './client.js';
import type { QdrantConfig } from '../../../../config/services/ai/qdrant/index.js';
import type { Application } from 'express';

export async function init(config: QdrantConfig, _appObj: Application) {
  return createClient(config);
}

export { getClient, getConfig, disconnect };

export type { QdrantConfig };

export default { init, getClient, getConfig, disconnect };
