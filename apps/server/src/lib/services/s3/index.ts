import { createClient, getClient, getConfig, disconnect, S3LibConfig } from './client.js';
import * as s3Service from './service.js';
import type { AwsConfig } from '../../../config/services/aws/index.js';

export async function init(config: AwsConfig) {
  const s3Config = config.services.s3 as {
    bucket: string;
    audioBucket: string;
    region: string;
    publicUrl: string;
    signedUrlExpiry: number;
    maxFileSize: number;
    allowedMimeTypes: string[];
  };

  const libConfig: S3LibConfig = {
    region: config.region,
    credentials: config.credentials,
    bucket: s3Config.bucket,
    audioBucket: s3Config.audioBucket,
    publicUrl: s3Config.publicUrl,
    signedUrlExpiry: s3Config.signedUrlExpiry,
    maxFileSize: s3Config.maxFileSize,
    allowedMimeTypes: s3Config.allowedMimeTypes,
  };

  return createClient(libConfig);
}

// Export client functions
export { getClient, getConfig, disconnect };

// Export service functions
export { s3Service };

// Export types
export type { S3LibConfig };

export default { init, getClient, getConfig, disconnect, s3Service };
