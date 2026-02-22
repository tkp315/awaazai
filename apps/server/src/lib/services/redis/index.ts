import { Application } from 'express';
import { createClients, getClient, getAllClients, disconnectAll, RedisConfig } from './client.js';
import * as redisService from './service.js';

export async function init(config: RedisConfig, appObj: Application) {
  return createClients(config);
}

// Export client functions
export { getClient, getAllClients, disconnectAll };

// Export service functions
export { redisService };

// Export types
export type { RedisConfig };

export default { init, getClient, getAllClients, disconnectAll, redisService };
