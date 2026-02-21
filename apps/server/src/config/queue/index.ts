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
  };
}

async function queueConfig(): Promise<QueueConfig> {
  return {
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
    },
  };
}

export default queueConfig;
