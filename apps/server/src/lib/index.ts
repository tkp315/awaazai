import initServices from './services/index.js';
import initHelpers from './helper/index.js';
import type { ConfigResult } from '../config/index.js';

export interface LibResult {
  services: Record<string, unknown>;
  helper: Record<string, unknown>;
}

async function initLibs(config: ConfigResult): Promise<LibResult> {
  console.log('🔧 Initializing libs...\n');

  // Initialize helpers first (logger needed by services)
  console.log('📚 Initializing helpers...');
  const helper = await initHelpers(config.helper);
  console.log('📚 All helpers initialized!\n');

  // Initialize services (database, redis, s3, etc.)
  console.log('🔌 Initializing services...');
  const services = await initServices(config.services);
  console.log('🔌 All services initialized!\n');

  return { services, helper };
}

export default initLibs;
