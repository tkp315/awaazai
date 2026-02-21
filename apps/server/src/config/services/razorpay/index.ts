export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  currency: string;
  plans: {
    basic: {
      id: string;
      name: string;
      amount: number;
      interval: 'monthly' | 'yearly';
    };
    pro: {
      id: string;
      name: string;
      amount: number;
      interval: 'monthly' | 'yearly';
    };
    enterprise: {
      id: string;
      name: string;
      amount: number;
      interval: 'monthly' | 'yearly';
    };
  };
}

async function razorpayConfig(): Promise<RazorpayConfig> {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    currency: 'INR',
    plans: {
      basic: {
        id: process.env.RAZORPAY_PLAN_BASIC_ID || '',
        name: 'Basic',
        amount: 499, // INR
        interval: 'monthly',
      },
      pro: {
        id: process.env.RAZORPAY_PLAN_PRO_ID || '',
        name: 'Pro',
        amount: 999, // INR
        interval: 'monthly',
      },
      enterprise: {
        id: process.env.RAZORPAY_PLAN_ENTERPRISE_ID || '',
        name: 'Enterprise',
        amount: 4999, // INR
        interval: 'monthly',
      },
    },
  };
}

export default razorpayConfig;
