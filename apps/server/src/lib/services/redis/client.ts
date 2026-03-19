import IORedis from 'ioredis';
import { getLogger } from '../../helper/logger/index.js';
import { RedisConfig } from '@config/services/redis/index.js';
export type { RedisConfig };


type RedisClient = InstanceType<typeof IORedis.Redis>;
const redisClients: Map<string, RedisClient> = new Map();
let redisConfig: RedisConfig | null = null;

export async function createClients(config: RedisConfig): Promise<Map<string, RedisClient>> {
  const logger = getLogger();
  redisConfig = config;
  const { host, port, password, tls, databases } = config;

  for (const [name, dbNumber] of Object.entries(databases)) {
    const client = new IORedis.Redis({
      host,
      port,
      password: password || undefined,
      db: dbNumber as number,
      tls: tls ? {} : undefined,
      retryStrategy: (times: number) => {
        return Math.min(times * 500, 5000);
      },
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      connectTimeout: 10000,
    });

    client.on('error', (err: Error) => {
      logger.error(`Redis ${name} error`, { error: err.message });
    });

    client.on('connect', () => {
      logger.info(`✅ Redis ${name} connected`, { db: dbNumber });
    });

    redisClients.set(name, client);
  }

  return redisClients;
}

export function getClient(name: 'cache' | 'queue' | 'session' | 'rateLimit'): RedisClient {
  const client = redisClients.get(name);
  if (!client) {
    throw new Error(`Redis ${name} not initialized`);
  }
  return client;
}

export function getAllClients(): Map<string, RedisClient> {
  return redisClients;
}

export async function disconnectAll(): Promise<void> {
  const logger = getLogger();
  for (const [name, client] of redisClients) {
    await client.quit();
    logger.info(`Redis ${name} disconnected`);
  }
  redisClients.clear();
}
