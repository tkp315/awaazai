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
import type { RedisConfig } from '../redis/client.js';

interface InitConfig {
  queue: QueueConfig;
  redis: RedisConfig;
}

export async function init(config: InitConfig) {
  const libConfig: QueueLibConfig = {
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password || undefined,
      db: config.redis.databases.queue,
    },
    queue: config.queue,
  };

  return createQueues(libConfig);
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
