import { Worker } from 'bullmq';
import { getRedisConnection } from '@lib/services/queue/client.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { processCloningJob } from './cloning.processor.js';

interface CloningJobData {
  botVoiceId: string;
  botId: string;
  userId: string;
}

let cloningWorker: Worker<CloningJobData> | null = null;

export function initCloningWorker(): Worker<CloningJobData> {
  const logger = getLogger();

  cloningWorker = new Worker<CloningJobData>(
    'voice-clone',
    async job => {
      return await processCloningJob(job.data);
    },
    {
      connection: getRedisConnection(),
      concurrency: 2,
      prefix: 'awaazai',
    }
  );

  cloningWorker.on('completed', job => {
    logger.info(`Cloning job ${job.id} completed`);
  });

  cloningWorker.on('failed', (job, err) => {
    logger.error(`Cloning job ${job?.id} failed`, { error: err.message });
  });

  logger.info('✅ Cloning worker initialized');
  return cloningWorker;
}

export function getCloningWorker(): Worker<CloningJobData> | null {
  return cloningWorker;
}
