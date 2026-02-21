import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
}

async function envConfig(): Promise<EnvConfig> {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
  };
}

export default envConfig;
