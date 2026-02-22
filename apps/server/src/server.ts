import { app, init } from './app.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { disconnectAll as disconnectRedis } from '@lib/services/redis/index.js';
import { disconnectAll as disconnectQueue } from '@lib/services/queue/index.js';

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
}

async function startServer() {
  try {
    // 1. Initialize config + libs
    await init();

    const logger = getLogger();
    const envConfig = app.config.app.env as EnvConfig;
    const port = envConfig.PORT;
    const env = envConfig.NODE_ENV;

    // 2. Start server
    const server = app.listen(port, () => {
      logger.info(`🚀 ${env} Server running on port ${port}`);
    });

    // 3. Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectQueue();
        await disconnectRedis();
        logger.info('All connections closed. Exiting.');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
