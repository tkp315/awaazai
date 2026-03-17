import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { getLogger } from '../../helper/logger/index.js';
import type { QueueConfig, QueueJobConfig } from '../../../config/services/queue/index.js';

type RedisConnection = InstanceType<typeof IORedis>;

const queues: Map<string, Queue> = new Map();
const workers: Map<string, Worker> = new Map();
const queueEvents: Map<string, QueueEvents> = new Map();

let redisConnection: RedisConnection | null = null;
let queueConfig: QueueConfig | null = null;

export interface QueueLibConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  queue: QueueConfig;
}

export async function createQueues(config: QueueLibConfig): Promise<Map<string, Queue>> {
  const logger = getLogger();

  // Create Redis connection for BullMQ
  redisConnection = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    db: config.redis.db,
    maxRetriesPerRequest: null, // Required for BullMQ
  });

  queueConfig = config.queue;

  // Create queues for each job type
  for (const [jobType, jobConfig] of Object.entries(config.queue.jobs) as [
    string,
    QueueJobConfig,
  ][]) {
    const queue = new Queue(jobConfig.name, {
      connection: redisConnection,
      prefix: config.queue.prefix,
      defaultJobOptions: {
        attempts: jobConfig.attempts,
        backoff: jobConfig.backoff,
        removeOnComplete: jobConfig.removeOnComplete,
        removeOnFail: jobConfig.removeOnFail,
      },
    });

    queues.set(jobType, queue);
    logger.info(`✅ Queue created: ${jobConfig.name}`, { jobType });
  }

  return queues;
}

export function getQueue(name: 'voiceClone' | 'tts' | 'stt' | 'meeting' | 'training'): Queue {
  const queue = queues.get(name);
  if (!queue) {
    throw new Error(`Queue ${name} not initialized`);
  }
  return queue;
}

export function getAllQueues(): Map<string, Queue> {
  return queues;
}

export function getRedisConnection(): RedisConnection {
  if (!redisConnection) {
    throw new Error('Queue Redis connection not initialized');
  }
  return redisConnection;
}

export function getQueueConfig(): QueueConfig {
  if (!queueConfig) {
    throw new Error('Queue config not initialized');
  }
  return queueConfig;
}

export function registerWorker(
  queueName: 'voiceClone' | 'tts' | 'stt' | 'meeting' | 'training',
  processor: (job: { id?: string; name: string; data: unknown }) => Promise<unknown>
): Worker {
  const logger = getLogger();
  const config = getQueueConfig();
  const jobConfig = config.jobs[queueName];

  if (!redisConnection) {
    throw new Error('Queue Redis connection not initialized');
  }

  const worker = new Worker(jobConfig.name, processor, {
    connection: redisConnection,
    prefix: config.prefix,
    concurrency: jobConfig.concurrency,
  });

  worker.on('completed', job => {
    logger.info(`Job completed: ${job.id}`, { queue: queueName });
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job failed: ${job?.id}`, { queue: queueName, error: err.message });
  });

  workers.set(queueName, worker);
  logger.info(`✅ Worker registered: ${jobConfig.name}`, { concurrency: jobConfig.concurrency });

  return worker;
}

export function getWorker(name: 'voiceClone' | 'tts' | 'stt' | 'meeting' | 'training'): Worker | undefined {
  return workers.get(name);
}

export function registerQueueEvents(
  queueName: 'voiceClone' | 'tts' | 'stt' | 'meeting' | 'training'
): QueueEvents {
  const config = getQueueConfig();
  const jobConfig = config.jobs[queueName];

  if (!redisConnection) {
    throw new Error('Queue Redis connection not initialized');
  }

  const events = new QueueEvents(jobConfig.name, {
    connection: redisConnection,
    prefix: config.prefix,
  });

  queueEvents.set(queueName, events);
  return events;
}

export async function disconnectAll(): Promise<void> {
  const logger = getLogger();

  // Close all workers
  for (const [name, worker] of workers) {
    await worker.close();
    logger.info(`Worker closed: ${name}`);
  }
  workers.clear();

  // Close all queue events
  for (const [name, events] of queueEvents) {
    await events.close();
    logger.info(`QueueEvents closed: ${name}`);
  }
  queueEvents.clear();

  // Close all queues
  for (const [name, queue] of queues) {
    await queue.close();
    logger.info(`Queue closed: ${name}`);
  }
  queues.clear();

  // Close Redis connection
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
    logger.info('Queue Redis connection closed');
  }

  queueConfig = null;
}
