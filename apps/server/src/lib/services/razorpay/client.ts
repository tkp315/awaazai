import Razorpay from 'razorpay';

let client: Razorpay | null = null;
let _keySecret: string = '';

export function initRazorpay(keyId: string, keySecret: string): void {
  client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  _keySecret = keySecret;
}

export function getClient(): Razorpay {
  if (!client) throw new Error('Razorpay not initialized');
  return client;
}

export function getKeySecret(): string {
  return _keySecret;
}
