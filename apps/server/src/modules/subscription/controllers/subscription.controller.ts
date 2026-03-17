import type { Request, Response } from 'express';
import crypto from 'crypto';
import { subscriptionService } from '../services/subscription.service.js';
import { getClient, getKeySecret } from '@lib/services/razorpay/client.js';
import { getPrisma } from '@lib/services/database/prisma/index.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { z } from 'zod';

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  starter: { monthly: 199, yearly: 1990 },
  pro:     { monthly: 499, yearly: 4990 },
};

// ── GET /subscriptions/me ─────────────────────────────────────────────────────
export async function getMySubscription(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;

  let subscription = await subscriptionService.getActiveSubscription(userId);

  // Auto-assign free plan if missing
  if (!subscription) {
    await subscriptionService.assignFreePlan(userId);
    subscription = await subscriptionService.getActiveSubscription(userId);
  }

  res.json({ success: true, data: subscription });
}

// ── GET /subscriptions/plans ──────────────────────────────────────────────────
export async function getPlans(req: Request, res: Response): Promise<void> {
  const plans = await subscriptionService.getAllPlans();
  res.json({ success: true, data: plans });
}

// ── POST /subscriptions/create-order ─────────────────────────────────────────
const createOrderSchema = z.object({
  planSlug: z.enum(['starter', 'pro']),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
});

export async function createOrder(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const userId = (req as any).user.id;

  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues }); return; }

  const { planSlug, billingCycle } = parsed.data;
  const prices = PLAN_PRICES[planSlug];
  const amount = billingCycle === 'YEARLY' ? prices.yearly : prices.monthly;

  try {
    const razorpay = getClient();
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `sub_${userId}_${Date.now()}`,
      notes: { userId, planSlug, billingCycle },
    });

    logger.info('[SUBSCRIPTION] Order created', { userId, planSlug, orderId: order.id });
    res.json({ success: true, data: { orderId: order.id, amount, currency: 'INR', planSlug, billingCycle } });
  } catch (err) {
    logger.error('[SUBSCRIPTION] Order creation failed', { err });
    res.status(500).json({ message: 'Payment order creation failed' });
  }
}

// ── POST /subscriptions/verify ────────────────────────────────────────────────
const verifySchema = z.object({
  razorpayOrderId:   z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  planSlug:          z.enum(['starter', 'pro']),
  billingCycle:      z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
});

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const userId = (req as any).user.id;

  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Invalid input' }); return; }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planSlug, billingCycle } = parsed.data;

  // Verify signature
  const keySecret = getKeySecret();
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSig = crypto.createHmac('sha256', keySecret).update(body).digest('hex');

  if (expectedSig !== razorpaySignature) {
    res.status(400).json({ message: 'Payment verification failed — invalid signature' });
    return;
  }

  try {
    // Activate subscription
    const subscription = await subscriptionService.activateSubscription(userId, planSlug, razorpayPaymentId, billingCycle);

    // Save payment record
    const prisma = getPrisma();
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: PLAN_PRICES[planSlug][billingCycle === 'YEARLY' ? 'yearly' : 'monthly'],
        currency: 'INR',
        status: 'SUCCESS',
        paymentMethod: 'UPI',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date(),
      },
    });

    logger.info('[SUBSCRIPTION] Payment verified', { userId, planSlug, razorpayPaymentId });
    res.json({ success: true, data: subscription });
  } catch (err) {
    logger.error('[SUBSCRIPTION] Activation failed', { err });
    res.status(500).json({ message: 'Subscription activation failed' });
  }
}

// ── POST /subscriptions/cancel ────────────────────────────────────────────────
export async function cancelSubscription(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  await subscriptionService.cancelSubscription(userId);
  res.json({ success: true, message: 'Subscription cancelled. You are now on the Free plan.' });
}

// ── GET /subscriptions/limits ─────────────────────────────────────────────────
export async function getMyLimits(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;

  const [voiceClones, voiceChats, aiBots] = await Promise.all([
    subscriptionService.checkLimit(userId, 'VOICE_CLONES'),
    subscriptionService.checkLimit(userId, 'VOICE_CHATS'),
    subscriptionService.checkLimit(userId, 'AI_BOTS'),
  ]);

  res.json({
    success: true,
    data: {
      VOICE_CLONES: voiceClones,
      VOICE_CHATS: voiceChats,
      AI_BOTS: aiBots,
    },
  });
}

// ── GET /subscriptions/usage ──────────────────────────────────────────────────
// Returns current limits + full UsageTrack history for the active subscription
export async function getMyUsage(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const prisma = getPrisma();

  const subscription = await subscriptionService.getActiveSubscription(userId);
  if (!subscription) {
    res.json({ success: true, data: { limits: {}, history: [] } });
    return;
  }

  // Current limits
  const [voiceClones, voiceChats, aiBots] = await Promise.all([
    subscriptionService.checkLimit(userId, 'VOICE_CLONES'),
    subscriptionService.checkLimit(userId, 'VOICE_CHATS'),
    subscriptionService.checkLimit(userId, 'AI_BOTS'),
  ]);

  // Full usage history from UsageTrack (last 12 periods per key)
  const history = await prisma.usageTrack.findMany({
    where: { subscriptionId: subscription.id },
    orderBy: [{ limitKey: 'asc' }, { period: 'desc' }],
    take: 36, // up to 12 periods × 3 keys
  });

  res.json({
    success: true,
    data: {
      plan: {
        name: subscription.plan.name,
        slug: subscription.plan.slug,
        billingCycle: subscription.billingCycle,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      limits: {
        VOICE_CLONES: voiceClones,
        VOICE_CHATS: voiceChats,
        AI_BOTS: aiBots,
      },
      history,
    },
  });
}

// ── GET /subscriptions/payments ───────────────────────────────────────────────
export async function getMyPayments(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const prisma = getPrisma();

  const payments = await prisma.payment.findMany({
    where: { subscription: { userId } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      subscription: {
        select: { plan: { select: { name: true, slug: true } }, billingCycle: true },
      },
    },
  });

  res.json({ success: true, data: payments });
}
