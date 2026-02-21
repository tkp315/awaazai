import initServices from './services/index.js';
import initHelpers from './helper/index.js';
import type { ConfigResult } from '../config/index.js';

export interface LibResult {
  services: Record<string, unknown>;
  helper: Record<string, unknown>;
}

async function initLibs(config: ConfigResult): Promise<LibResult> {
  // Initialize helpers first (logger needed by services)
  const helper = await initHelpers(config.helper);

  // Initialize services (database, redis, s3, etc.)
  const services = await initServices(config.services);

  return { services, helper };
}

export default initLibs;
