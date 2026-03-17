import { Worker } from 'bullmq';
import { getRedisConnection } from '@lib/services/queue/client.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { processTraining, type TrainingJobData } from './training.processor.js';

let trainingWorker: Worker<TrainingJobData> | null = null;

export function initTrainingWorker(): Worker<TrainingJobData> {
  const logger = getLogger();

  trainingWorker = new Worker<TrainingJobData>(
    'bot-training',
    async (job) => {
      return await processTraining(job.data);
    },
    {
      connection: getRedisConnection(), // called after services are initialized
      concurrency: 2,
    }
  );

  trainingWorker.on('completed', (job) => {
    logger.info(`Training job ${job.id} completed`);
  });

  trainingWorker.on('failed', (job, err) => {
    logger.error(`Training job ${job?.id} failed`, { error: err.message });
  });

  logger.info('✅ Training worker initialized');
  return trainingWorker;
}

export function getTrainingWorker(): Worker<TrainingJobData> | null {
  return trainingWorker;
}
