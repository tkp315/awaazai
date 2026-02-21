import { Job, JobsOptions } from 'bullmq';
import { getQueue, getQueueConfig } from './client.js';

type QueueName = 'voiceClone' | 'tts' | 'stt' | 'meeting';

// ============================================
// ADD JOB OPERATIONS
// ============================================

export async function addJob<T>(
  queueName: QueueName,
  jobName: string,
  data: T,
  options?: JobsOptions
): Promise<Job<T>> {
  const queue = getQueue(queueName);
  return queue.add(jobName, data, options) as Promise<Job<T>>;
}

export async function addBulkJobs<T>(
  queueName: QueueName,
  jobs: Array<{ name: string; data: T; opts?: JobsOptions }>
): Promise<Job<T>[]> {
  const queue = getQueue(queueName);
  return queue.addBulk(jobs) as Promise<Job<T>[]>;
}

export async function addDelayedJob<T>(
  queueName: QueueName,
  jobName: string,
  data: T,
  delayMs: number,
  options?: JobsOptions
): Promise<Job<T>> {
  const queue = getQueue(queueName);
  return queue.add(jobName, data, {
    ...options,
    delay: delayMs,
  }) as Promise<Job<T>>;
}

export async function addScheduledJob<T>(
  queueName: QueueName,
  jobName: string,
  data: T,
  repeatPattern: string, // cron pattern
  options?: JobsOptions
): Promise<Job<T>> {
  const queue = getQueue(queueName);
  return queue.add(jobName, data, {
    ...options,
    repeat: {
      pattern: repeatPattern,
    },
  }) as Promise<Job<T>>;
}

// ============================================
// GET JOB OPERATIONS
// ============================================

export async function getJob<T>(queueName: QueueName, jobId: string): Promise<Job<T> | undefined> {
  const queue = getQueue(queueName);
  return queue.getJob(jobId) as Promise<Job<T> | undefined>;
}

export async function getJobs<T>(
  queueName: QueueName,
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
  start: number = 0,
  end: number = 100
): Promise<Job<T>[]> {
  const queue = getQueue(queueName);
  return queue.getJobs([status], start, end) as Promise<Job<T>[]>;
}

export async function getWaitingJobs<T>(
  queueName: QueueName,
  start?: number,
  end?: number
): Promise<Job<T>[]> {
  return getJobs<T>(queueName, 'waiting', start, end);
}

export async function getActiveJobs<T>(
  queueName: QueueName,
  start?: number,
  end?: number
): Promise<Job<T>[]> {
  return getJobs<T>(queueName, 'active', start, end);
}

export async function getCompletedJobs<T>(
  queueName: QueueName,
  start?: number,
  end?: number
): Promise<Job<T>[]> {
  return getJobs<T>(queueName, 'completed', start, end);
}

export async function getFailedJobs<T>(
  queueName: QueueName,
  start?: number,
  end?: number
): Promise<Job<T>[]> {
  return getJobs<T>(queueName, 'failed', start, end);
}

export async function getDelayedJobs<T>(
  queueName: QueueName,
  start?: number,
  end?: number
): Promise<Job<T>[]> {
  return getJobs<T>(queueName, 'delayed', start, end);
}

// ============================================
// REMOVE JOB OPERATIONS
// ============================================

export async function removeJob(queueName: QueueName, jobId: string): Promise<void> {
  const job = await getJob(queueName, jobId);
  if (job) {
    await job.remove();
  }
}

export async function removeJobs(
  queueName: QueueName,
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed'
): Promise<void> {
  const queue = getQueue(queueName);

  switch (status) {
    case 'completed':
      await queue.clean(0, 1000, 'completed');
      break;
    case 'failed':
      await queue.clean(0, 1000, 'failed');
      break;
    case 'delayed':
      await queue.clean(0, 1000, 'delayed');
      break;
    case 'waiting':
      await queue.clean(0, 1000, 'wait');
      break;
    case 'active':
      await queue.clean(0, 1000, 'active');
      break;
  }
}

// ============================================
// RETRY OPERATIONS
// ============================================

export async function retryJob(queueName: QueueName, jobId: string): Promise<void> {
  const job = await getJob(queueName, jobId);
  if (job) {
    await job.retry();
  }
}

export async function retryAllFailed(queueName: QueueName): Promise<void> {
  const failedJobs = await getFailedJobs(queueName, 0, 1000);
  await Promise.all(failedJobs.map(job => job.retry()));
}

// ============================================
// QUEUE STATS
// ============================================

export async function getQueueStats(queueName: QueueName): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  const queue = getQueue(queueName);
  const counts = await queue.getJobCounts();

  return {
    waiting: counts.waiting || 0,
    active: counts.active || 0,
    completed: counts.completed || 0,
    failed: counts.failed || 0,
    delayed: counts.delayed || 0,
  };
}

export async function getAllQueueStats(): Promise<
  Record<
    QueueName,
    { waiting: number; active: number; completed: number; failed: number; delayed: number }
  >
> {
  const queueNames: QueueName[] = ['voiceClone', 'tts', 'stt', 'meeting'];
  const stats = await Promise.all(
    queueNames.map(async name => ({
      name,
      stats: await getQueueStats(name),
    }))
  );

  return stats.reduce(
    (acc, { name, stats }) => ({
      ...acc,
      [name]: stats,
    }),
    {} as Record<
      QueueName,
      { waiting: number; active: number; completed: number; failed: number; delayed: number }
    >
  );
}

// ============================================
// PAUSE / RESUME
// ============================================

export async function pauseQueue(queueName: QueueName): Promise<void> {
  const queue = getQueue(queueName);
  await queue.pause();
}

export async function resumeQueue(queueName: QueueName): Promise<void> {
  const queue = getQueue(queueName);
  await queue.resume();
}

export async function isPaused(queueName: QueueName): Promise<boolean> {
  const queue = getQueue(queueName);
  return queue.isPaused();
}

// ============================================
// DRAIN / OBLITERATE
// ============================================

export async function drainQueue(queueName: QueueName): Promise<void> {
  const queue = getQueue(queueName);
  await queue.drain();
}

export async function obliterateQueue(queueName: QueueName): Promise<void> {
  const queue = getQueue(queueName);
  await queue.obliterate();
}
