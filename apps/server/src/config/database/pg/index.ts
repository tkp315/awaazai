interface PostgresConfig {
  url: string;
  host: string;
  password: string;
  username: string;
  db: string;
  maxConnections: number;
  logging: boolean;
  ssl: boolean;
}

async function pgConfig(): Promise<PostgresConfig> {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    url: process.env.DATABASE_URL || '',
    maxConnections: parseInt(process.env.PG_MAX_CONNECTIONS || '20', 10),
    ssl: isProduction,
    logging: !isProduction,
    host: process.env.DB_HOST || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    db: process.env.DB_NAME || '',
  };
}

export default pgConfig;
