import { getClient } from './client.js';

type RedisClientType = 'cache' | 'queue' | 'session' | 'rateLimit';

// ============================================
// STRING OPERATIONS
// ============================================

export async function get(
  key: string,
  clientType: RedisClientType = 'cache'
): Promise<string | null> {
  const client = getClient(clientType);
  return client.get(key);
}

export async function set(
  key: string,
  value: string,
  ttlSeconds?: number,
  clientType: RedisClientType = 'cache'
): Promise<'OK'> {
  const client = getClient(clientType);
  if (ttlSeconds) {
    return client.set(key, value, 'EX', ttlSeconds);
  }
  return client.set(key, value);
}

export async function del(key: string, clientType: RedisClientType = 'cache'): Promise<number> {
  const client = getClient(clientType);
  return client.del(key);
}

export async function exists(key: string, clientType: RedisClientType = 'cache'): Promise<number> {
  const client = getClient(clientType);
  return client.exists(key);
}

export async function expire(
  key: string,
  seconds: number,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.expire(key, seconds);
}

export async function ttl(key: string, clientType: RedisClientType = 'cache'): Promise<number> {
  const client = getClient(clientType);
  return client.ttl(key);
}

// ============================================
// JSON OPERATIONS (Wrapper)
// ============================================

export async function getJson<T>(
  key: string,
  clientType: RedisClientType = 'cache'
): Promise<T | null> {
  const data = await get(key, clientType);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setJson<T>(
  key: string,
  value: T,
  ttlSeconds?: number,
  clientType: RedisClientType = 'cache'
): Promise<'OK'> {
  return set(key, JSON.stringify(value), ttlSeconds, clientType);
}

// ============================================
// HASH OPERATIONS
// ============================================

export async function hget(
  key: string,
  field: string,
  clientType: RedisClientType = 'cache'
): Promise<string | null> {
  const client = getClient(clientType);
  return client.hget(key, field);
}

export async function hset(
  key: string,
  field: string,
  value: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.hset(key, field, value);
}

export async function hgetall(
  key: string,
  clientType: RedisClientType = 'cache'
): Promise<Record<string, string>> {
  const client = getClient(clientType);
  return client.hgetall(key);
}

export async function hdel(
  key: string,
  field: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.hdel(key, field);
}

export async function hincrby(
  key: string,
  field: string,
  increment: number,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.hincrby(key, field, increment);
}

// ============================================
// LIST OPERATIONS
// ============================================

export async function lpush(
  key: string,
  value: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.lpush(key, value);
}

export async function rpush(
  key: string,
  value: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.rpush(key, value);
}

export async function lpop(
  key: string,
  clientType: RedisClientType = 'cache'
): Promise<string | null> {
  const client = getClient(clientType);
  return client.lpop(key);
}

export async function rpop(
  key: string,
  clientType: RedisClientType = 'cache'
): Promise<string | null> {
  const client = getClient(clientType);
  return client.rpop(key);
}

export async function lrange(
  key: string,
  start: number,
  stop: number,
  clientType: RedisClientType = 'cache'
): Promise<string[]> {
  const client = getClient(clientType);
  return client.lrange(key, start, stop);
}

export async function llen(key: string, clientType: RedisClientType = 'cache'): Promise<number> {
  const client = getClient(clientType);
  return client.llen(key);
}

// ============================================
// SET OPERATIONS
// ============================================

export async function sadd(
  key: string,
  member: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.sadd(key, member);
}

export async function srem(
  key: string,
  member: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.srem(key, member);
}

export async function smembers(
  key: string,
  clientType: RedisClientType = 'cache'
): Promise<string[]> {
  const client = getClient(clientType);
  return client.smembers(key);
}

export async function sismember(
  key: string,
  member: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.sismember(key, member);
}

// ============================================
// INCREMENT / DECREMENT
// ============================================

export async function incr(key: string, clientType: RedisClientType = 'cache'): Promise<number> {
  const client = getClient(clientType);
  return client.incr(key);
}

export async function decr(key: string, clientType: RedisClientType = 'cache'): Promise<number> {
  const client = getClient(clientType);
  return client.decr(key);
}

export async function incrby(
  key: string,
  increment: number,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  return client.incrby(key, increment);
}

// ============================================
// PATTERN OPERATIONS
// ============================================

export async function keys(
  pattern: string,
  clientType: RedisClientType = 'cache'
): Promise<string[]> {
  const client = getClient(clientType);
  return client.keys(pattern);
}

export async function delByPattern(
  pattern: string,
  clientType: RedisClientType = 'cache'
): Promise<number> {
  const client = getClient(clientType);
  const matchingKeys = await client.keys(pattern);
  if (matchingKeys.length === 0) return 0;
  return client.del(...matchingKeys);
}

// ============================================
// UTILITY
// ============================================

export async function flushDb(clientType: RedisClientType = 'cache'): Promise<'OK'> {
  const client = getClient(clientType);
  return client.flushdb();
}

export async function ping(clientType: RedisClientType = 'cache'): Promise<string> {
  const client = getClient(clientType);
  return client.ping();
}
