export interface LoggerConfig {
  level: string;
  format: 'json' | 'pretty';
  console: {
    enabled: boolean;
    colorize: boolean;
  };
  file: {
    enabled: boolean;
    dirname: string;
    filename: string;
    maxSize: string;
    maxFiles: string;
  };
  error: {
    filename: string;
  };
}

async function loggerConfig(): Promise<LoggerConfig> {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    format: isProduction ? 'json' : 'pretty',

    // Console output
    console: {
      enabled: true,
      colorize: !isProduction,
    },

    // File output
    file: {
      enabled: isProduction,
      dirname: process.env.LOG_DIR || 'logs',
      filename: 'app-%DATE%.log',
      maxSize: '20m', // 20MB per file
      maxFiles: '14d', // 14 days retention
    },

    // Error logs separate
    error: {
      filename: 'error-%DATE%.log',
    },
  };
}

export default loggerConfig;
