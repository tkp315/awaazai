import { createClient, getClient, getConfig, disconnect } from './client.js';
import * as openaiService from './service.js';
import type { OpenAIConfig } from '../../../../config/services/ai/openai/index.js';

export async function init(config: OpenAIConfig) {
  return createClient(config);
}

// Export client functions
export { getClient, getConfig, disconnect };

// Export service functions
export { openaiService };

// Export types
export type { OpenAIConfig };

export default { init, getClient, getConfig, disconnect, openaiService };
