export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  tls: boolean;
  databases: {
    cache: number;
    queue: number;
    session: number;
    rateLimit: number;
  };
}

async function redisConfig(): Promise<RedisConfig> {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`REDIS HOST ${process.env.REDIS_HOST}`);
  console.log(`REDIS PASSWORD ${process.env.REDIS_HOST}`);
  // console.log(`REDIS HOST ${process.env.REDIS_HOST}`);

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    tls: isProduction,
    databases: {
      cache: 0,
      queue: 1,
      session: 2,
      rateLimit: 3,
    },
  };
}
export default redisConfig;
