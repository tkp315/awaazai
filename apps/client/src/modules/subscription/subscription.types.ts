// ── Plan ──────────────────────────────────────────────────────────────────────

export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE';
export type LimitKey = 'VOICE_CLONES' | 'VOICE_CHATS' | 'AI_BOTS';
export type ResetPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'NEVER';

export interface IPlanFeature {
  id: string;
  limitKey: LimitKey;
  limitValue: number; // -1 = unlimited
  resetPeriod: ResetPeriod;
}

export interface IPlan {
  id: string;
  name: string;
  slug: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  features: IPlanFeature[];
}

// ── Subscription ──────────────────────────────────────────────────────────────

export interface ISubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  razorpaySubscriptionId: string | null;
  cancelledAt: string | null;
  createdAt: string;
  plan: IPlan;
}

// ── Limits ────────────────────────────────────────────────────────────────────

export interface ILimitStatus {
  allowed: boolean;
  used: number;
  limit: number; // -1 = unlimited
}

export interface IMyLimits {
  VOICE_CLONES: ILimitStatus;
  VOICE_CHATS: ILimitStatus;
  AI_BOTS: ILimitStatus;
}

// ── Payment ───────────────────────────────────────────────────────────────────

export interface ICreateOrderPayload {
  planSlug: string;
  billingCycle: BillingCycle;
}

export interface ICreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  planSlug: string;
  billingCycle: BillingCycle;
}

export interface IVerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  planSlug: string;
  billingCycle: BillingCycle;
}

// ── Usage ─────────────────────────────────────────────────────────────────────

export interface IUsageTrackRecord {
  id: string;
  limitKey: LimitKey;
  used: number;
  period: string;
  lastUsedAt: string;
}

export interface IUsageData {
  plan: {
    name: string;
    slug: string;
    billingCycle: BillingCycle;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
  limits: IMyLimits;
  history: IUsageTrackRecord[];
}

// ── Payment ───────────────────────────────────────────────────────────────────

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface IPaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paidAt: string | null;
  createdAt: string;
  subscription: {
    plan: { name: string; slug: string };
    billingCycle: BillingCycle;
  };
}
