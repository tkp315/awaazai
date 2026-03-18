import dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'prisma/config';

const envFile = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production'
  ? '.env.prod'
  : '.env.dev';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default defineConfig({
  schema: 'prisma/schema', // Multi-file schema folder
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
    // Supabase ke liye direct connection (migrations ke liye)
    // directUrl: process.env['DIRECT_URL'],
  },
});
