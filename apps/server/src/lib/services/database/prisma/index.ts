import { PrismaClient } from 'generated/prisma/client.js';
import pgConfig, { PostgresConfig } from '@config/services/database/pg/index.js';
import { getLogger } from '@lib/helper/logger/index.js';

let prisma: PrismaClient;
async function initPrisma(config: PostgresConfig) {
  const logger = getLogger();

  prisma = new PrismaClient({
    accelerateUrl: config.url,
    log: config.logging
      ? [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ]
      : [],
  });

  if (config.logging) {
    prisma.$on('query' as never, (e: { query: string; duration: number }) => {
      logger.debug('Prisma Query', { query: e.query, duration: `${e.duration}ms` });
    });
  }

  await prisma.$connect();
  logger.info('PostgreSql connected');
  return prisma;
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error('Prisma not initialized');
  }
  return prisma;
}

export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    getLogger().info('PostgreSQL disconnected');
  }
}

export default { initPrisma, getPrisma, disconnectPrisma };
