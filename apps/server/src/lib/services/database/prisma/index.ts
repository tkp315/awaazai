import { PrismaClient } from 'generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PostgresConfig } from '@config/services/database/pg/index.js'; 
import { getLogger } from '@lib/helper/logger/index.js';
import { Application } from 'express';

let prisma: PrismaClient;

async function initPrisma(config: PostgresConfig, appObj: Application) {
  const logger = getLogger();

  const adapter = new PrismaPg({ connectionString: config.url });

  prisma = new PrismaClient({
    adapter,
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

export const init = initPrisma;

export default { init, initPrisma, getPrisma, disconnectPrisma };
