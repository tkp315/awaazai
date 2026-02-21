export interface MulterConfig {
  storage: 'memory' | 's3';
  limits: {
    fileSize: number;
    files: number;
  };
  audio: {
    allowedMimeTypes: string[];
    allowedExtensions: string[];
    maxDuration: number; // seconds
  };
  image: {
    allowedMimeTypes: string[];
    allowedExtensions: string[];
  };
  tempDir: string;
}

async function multerConfig(): Promise<MulterConfig> {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    // Production mein S3, dev mein memory
    storage: isProduction ? 's3' : 'memory',

    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
      files: 5, // Max 5 files at once
    },

    // Audio files (voice samples)
    audio: {
      allowedMimeTypes: [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/webm',
        'audio/ogg',
        'audio/m4a',
        'audio/x-m4a',
      ],
      allowedExtensions: ['.mp3', '.wav', '.webm', '.ogg', '.m4a'],
      maxDuration: 180, // 3 minutes max for voice sample
    },

    // Image files (avatar, org logo)
    image: {
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    },

    tempDir: process.env.TEMP_UPLOAD_DIR || '/tmp/awaazai-uploads',
  };
}

export default multerConfig;
