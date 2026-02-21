export interface S3Config {
  bucket: string;
  audioBucket: string;
  region: string;
  publicUrl: string;
  signedUrlExpiry: number;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

async function s3Config(): Promise<S3Config> {
  const region = process.env.AWS_REGION || 'ap-south-1';
  const bucket = process.env.AWS_S3_BUCKET || 'awaazai-storage';

  return {
    bucket,
    audioBucket: process.env.AWS_S3_AUDIO_BUCKET || 'awaazai-audio',
    region,
    publicUrl: `https://${bucket}.s3.${region}.amazonaws.com`,
    signedUrlExpiry: 3600, // 1 hour
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm'],
  };
}

export default s3Config;
