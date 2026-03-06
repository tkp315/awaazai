import { ConfigResult } from '@config/index.js';
import type { Transporter } from 'nodemailer';
import type { MailConfig } from '@config/services/mail/index.js';

// ============================================
// REDIS SERVICE TYPES
// ============================================
type RedisClientType = 'cache' | 'queue' | 'session' | 'rateLimit';

export interface RedisServiceType {
  // String operations
  get: (key: string, clientType?: RedisClientType) => Promise<string | null>;
  set: (key: string, value: string, ttlSeconds?: number, clientType?: RedisClientType) => Promise<'OK'>;
  del: (key: string, clientType?: RedisClientType) => Promise<number>;
  exists: (key: string, clientType?: RedisClientType) => Promise<number>;
  expire: (key: string, seconds: number, clientType?: RedisClientType) => Promise<number>;
  ttl: (key: string, clientType?: RedisClientType) => Promise<number>;

  // JSON operations
  getJson: <T>(key: string, clientType?: RedisClientType) => Promise<T | null>;
  setJson: <T>(key: string, value: T, ttlSeconds?: number, clientType?: RedisClientType) => Promise<'OK'>;

  // Hash operations
  hget: (key: string, field: string, clientType?: RedisClientType) => Promise<string | null>;
  hset: (key: string, field: string, value: string, clientType?: RedisClientType) => Promise<number>;
  hgetall: (key: string, clientType?: RedisClientType) => Promise<Record<string, string>>;
  hdel: (key: string, field: string, clientType?: RedisClientType) => Promise<number>;
  hincrby: (key: string, field: string, increment: number, clientType?: RedisClientType) => Promise<number>;

  // List operations
  lpush: (key: string, value: string, clientType?: RedisClientType) => Promise<number>;
  rpush: (key: string, value: string, clientType?: RedisClientType) => Promise<number>;
  lpop: (key: string, clientType?: RedisClientType) => Promise<string | null>;
  rpop: (key: string, clientType?: RedisClientType) => Promise<string | null>;
  lrange: (key: string, start: number, stop: number, clientType?: RedisClientType) => Promise<string[]>;
  llen: (key: string, clientType?: RedisClientType) => Promise<number>;

  // Set operations
  sadd: (key: string, member: string, clientType?: RedisClientType) => Promise<number>;
  srem: (key: string, member: string, clientType?: RedisClientType) => Promise<number>;
  smembers: (key: string, clientType?: RedisClientType) => Promise<string[]>;
  sismember: (key: string, member: string, clientType?: RedisClientType) => Promise<number>;

  // Increment/Decrement
  incr: (key: string, clientType?: RedisClientType) => Promise<number>;
  decr: (key: string, clientType?: RedisClientType) => Promise<number>;
  incrby: (key: string, increment: number, clientType?: RedisClientType) => Promise<number>;

  // Pattern operations
  keys: (pattern: string, clientType?: RedisClientType) => Promise<string[]>;
  delByPattern: (pattern: string, clientType?: RedisClientType) => Promise<number>;

  // Utility
  flushDb: (clientType?: RedisClientType) => Promise<'OK'>;
  ping: (clientType?: RedisClientType) => Promise<string>;

  // Client functions
  getClient: (name: RedisClientType) => unknown;
  getAllClients: () => Map<string, unknown>;
  disconnectAll: () => Promise<void>;
}

// ============================================
// MAIL SERVICE TYPES
// ============================================
interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface OTPMailOptions {
  to: string;
  otp: string;
  type: 'SIGNUP' | 'PASSWORD_RESET';
  expiryMinutes?: number;
}

export interface MailServiceType {
  sendMail: (options: SendMailOptions) => Promise<boolean>;
  sendOTPMail: (options: OTPMailOptions) => Promise<boolean>;
  sendWelcomeMail: (to: string, name: string) => Promise<boolean>;
  getTransporter: () => Transporter;
  getMailConfig: () => MailConfig;
  disconnect: () => Promise<void>;
}

// ============================================
// DATABASE SERVICE TYPES
// ============================================
export interface DatabaseServiceType {
  prisma?: unknown;
  mongo?: unknown;
}

// ============================================
// ALL SERVICES
// ============================================
export interface ServicesType {
  redis: RedisServiceType;
  mail: MailServiceType;
  database: DatabaseServiceType;
  s3?: unknown;
  razorpay?: unknown;
  queue?: unknown;
  ai?: unknown;
  meeting?: unknown;
}

// ============================================
// HELPER TYPES
// ============================================
export interface HelperType {
  logger?: unknown;
  jwt?: unknown;
  multer?: unknown;
  passport?: unknown;
}

// ============================================
// MAIN AA TYPE
// ============================================
export interface AwaazAI {
  config: ConfigResult;
  libs: {
    services: ServicesType;
    helper: HelperType;
  };
}
