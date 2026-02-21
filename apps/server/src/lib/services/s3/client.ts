import { S3Client } from '@aws-sdk/client-s3';
import { getLogger } from '../../helper/logger/index.js';

let s3Client: S3Client | null = null;

export interface S3LibConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  bucket: string;
  audioBucket: string;
  publicUrl: string;
  signedUrlExpiry: number;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

let s3Config: S3LibConfig | null = null;

export async function createClient(config: S3LibConfig): Promise<S3Client> {
  const logger = getLogger();

  s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.credentials.accessKeyId,
      secretAccessKey: config.credentials.secretAccessKey,
    },
  });

  s3Config = config;

  logger.info('✅ S3 client initialized', { region: config.region, bucket: config.bucket });

  return s3Client;
}

export function getClient(): S3Client {
  if (!s3Client) {
    throw new Error('S3 client not initialized');
  }
  return s3Client;
}

export function getConfig(): S3LibConfig {
  if (!s3Config) {
    throw new Error('S3 config not initialized');
  }
  return s3Config;
}

export async function disconnect(): Promise<void> {
  const logger = getLogger();
  if (s3Client) {
    s3Client.destroy();
    s3Client = null;
    s3Config = null;
    logger.info('S3 client disconnected');
  }
}
