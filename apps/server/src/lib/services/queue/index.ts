import {
  createQueues,
  getQueue,
  getAllQueues,
  getRedisConnection,
  getQueueConfig,
  registerWorker,
  getWorker,
  registerQueueEvents,
  disconnectAll,
  QueueLibConfig,
} from './client.js';
import * as queueService from './service.js';
import type { QueueConfig } from '../../../config/services/queue/index.js';
import { Application } from 'express';

export async function init(config: QueueConfig, appObj: Application) {
  try {
    const libConfig: QueueLibConfig = {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
      },
      queue: config,
    };

    return await createQueues(libConfig);
  } catch (error) {
    console.warn('⚠️ Queue initialization failed (Redis 5.0+ required):', (error as Error).message);
    return null;
  }
}

// Export client functions
export {
  getQueue,
  getAllQueues,
  getRedisConnection,
  getQueueConfig,
  registerWorker,
  getWorker,
  registerQueueEvents,
  disconnectAll,
};

// Export service functions
export { queueService };

// Export types
export type { QueueLibConfig };

export default {
  init,
  getQueue,
  getAllQueues,
  getRedisConnection,
  getQueueConfig,
  registerWorker,
  getWorker,
  registerQueueEvents,
  disconnectAll,
  queueService,
};
