import { createClient, getClient, getConfig, disconnect } from './client.js';
import * as elevenlabsService from './service.js';
import type { ElevenLabsConfig } from '../../../../config/services/ai/elevenlabs/index.js';

export async function init(config: ElevenLabsConfig) {
  return createClient(config);
}

// Export client functions
export { getClient, getConfig, disconnect };

// Export service functions
export { elevenlabsService };

// Export types
export type { ElevenLabsConfig };

export default { init, getClient, getConfig, disconnect, elevenlabsService };
