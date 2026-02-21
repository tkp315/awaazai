import Razorpay from 'razorpay';
import { getLogger } from '../../helper/logger/index.js';
import type { RazorpayConfig } from '../../../config/services/razorpay/index.js';

let razorpayClient: Razorpay | null = null;
let razorpayConfig: RazorpayConfig | null = null;

export async function createClient(config: RazorpayConfig): Promise<Razorpay> {
  const logger = getLogger();

  razorpayClient = new Razorpay({
    key_id: config.keyId,
    key_secret: config.keySecret,
  });

  razorpayConfig = config;

  logger.info('✅ Razorpay client initialized');

  return razorpayClient;
}

export function getClient(): Razorpay {
  if (!razorpayClient) {
    throw new Error('Razorpay client not initialized');
  }
  return razorpayClient;
}

export function getConfig(): RazorpayConfig {
  if (!razorpayConfig) {
    throw new Error('Razorpay config not initialized');
  }
  return razorpayConfig;
}

export async function disconnect(): Promise<void> {
  const logger = getLogger();
  razorpayClient = null;
  razorpayConfig = null;
  logger.info('Razorpay client disconnected');
}
