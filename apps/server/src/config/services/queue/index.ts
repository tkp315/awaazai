export interface QueueJobConfig {
  name: string;
  concurrency: number;
  attempts: number;
  backoff: {
    type: 'exponential' | 'fixed';
    delay: number;
  };
  timeout: number;
  removeOnComplete: boolean | number;
  removeOnFail: boolean | number;
}

export interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  prefix: string;
  defaultJobOptions: {
    attempts: number;
    backoff: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete: boolean | number;
    removeOnFail: boolean | number;
  };
  jobs: {
    voiceClone: QueueJobConfig;
    tts: QueueJobConfig;
    stt: QueueJobConfig;
    meeting: QueueJobConfig;
    training: QueueJobConfig;
  };
}

async function queueConfig(): Promise<QueueConfig> {
  return {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_QUEUE_DB || '1', 10),
    },
    prefix: 'awaazai',

    // Default options for all jobs
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000, // 1s, 2s, 4s...
      },
      removeOnComplete: 100, // Keep last 100
      removeOnFail: 50, // Keep last 50 failed
    },

    jobs: {
      // Voice cloning - heavy, slow
      voiceClone: {
        name: 'voice-clone',
        concurrency: 2, // 2 at a time
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        timeout: 5 * 60 * 1000, // 5 minutes
        removeOnComplete: 50,
        removeOnFail: 20,
      },

      // Text to Speech - fast
      tts: {
        name: 'tts',
        concurrency: 10,
        attempts: 3,
        backoff: { type: 'fixed', delay: 1000 },
        timeout: 30 * 1000, // 30 seconds
        removeOnComplete: 200,
        removeOnFail: 50,
      },

      // Speech to Text - medium
      stt: {
        name: 'stt',
        concurrency: 5,
        attempts: 3,
        backoff: { type: 'fixed', delay: 2000 },
        timeout: 60 * 1000, // 1 minute
        removeOnComplete: 200,
        removeOnFail: 50,
      },

      // Meeting - B2B, heavy
      meeting: {
        name: 'meeting',
        concurrency: 3,
        attempts: 2,
        backoff: { type: 'exponential', delay: 10000 },
        timeout: 10 * 60 * 1000, // 10 minutes
        removeOnComplete: 30,
        removeOnFail: 20,
      },

      // Bot training - embed knowledge into Qdrant
      training: {
        name: 'bot-training',
        concurrency: 2,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        timeout: 10 * 60 * 1000, // 10 minutes
        removeOnComplete: 50,
        removeOnFail: 30,
      },
    },
  };
}

export default queueConfig;
