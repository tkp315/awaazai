import { initRazorpay } from './client.js';

interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

export async function init(config: RazorpayConfig) {
  if (!config?.keyId || !config?.keySecret) {
    console.warn('  ⚠️  Razorpay keys missing — payment features disabled');
    return;
  }
  initRazorpay(config.keyId, config.keySecret);
}

export { getClient, getKeySecret } from './client.js';
