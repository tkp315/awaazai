import { getPrisma } from '@lib/services/database/prisma/index.js';
import type { LimitKey } from 'generated/prisma/client.js';

// -1 = unlimited
const UNLIMITED = -1;

export const subscriptionService = {

  // ── Get active subscription with plan + features ───────────────────────────
  getActiveSubscription: async (userId: string) => {
    const prisma = getPrisma();
    return prisma.subscription.findFirst({
      where: { userId, status: { in: ['ACTIVE', 'TRIAL'] } },
      include: {
        plan: { include: { features: true } },
        usageTrack: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // ── Get plan by slug ───────────────────────────────────────────────────────
  getPlanBySlug: async (slug: string) => {
    const prisma = getPrisma();
    return prisma.plan.findUnique({
      where: { slug },
      include: { features: true },
    });
  },

  // ── Get all active plans ───────────────────────────────────────────────────
  getAllPlans: async () => {
    const prisma = getPrisma();
    return prisma.plan.findMany({
      where: { isActive: true },
      include: { features: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  // ── Assign free plan on registration ──────────────────────────────────────
  assignFreePlan: async (userId: string) => {
    const prisma = getPrisma();

    const freePlan = await prisma.plan.findUnique({ where: { slug: 'free' } });
    if (!freePlan) throw new Error('Free plan not found in DB');

    const existing = await prisma.subscription.findFirst({
      where: { userId, status: { in: ['ACTIVE', 'TRIAL'] } },
    });
    if (existing) return existing;

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setFullYear(periodEnd.getFullYear() + 10); // free = no expiry

    return prisma.subscription.create({
      data: {
        userId,
        planId: freePlan.id,
        status: 'ACTIVE',
        billingCycle: 'MONTHLY',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });
  },

  // ── Check if user is within limit ─────────────────────────────────────────
  checkLimit: async (
    userId: string,
    limitKey: LimitKey
  ): Promise<{ allowed: boolean; used: number; limit: number }> => {
    const prisma = getPrisma();

    const subscription = await subscriptionService.getActiveSubscription(userId);

    // No subscription → treat as free
    if (!subscription) {
      await subscriptionService.assignFreePlan(userId);
      return subscriptionService.checkLimit(userId, limitKey);
    }

    const feature = subscription.plan.features.find(f => f.limitKey === limitKey);
    const limit = feature?.limitValue ?? 0;

    // Unlimited
    if (limit === UNLIMITED) return { allowed: true, used: 0, limit: UNLIMITED };

    // For NEVER reset limits (voice clones, bots, chats) — count from DB directly
    if (feature?.resetPeriod === 'NEVER') {
      const used = await countDirectUsage(prisma, userId, limitKey);
      return { allowed: used < limit, used, limit };
    }

    // For periodic limits — use UsageTrack
    const period = getCurrentPeriod(feature?.resetPeriod ?? 'MONTHLY');
    const track = subscription.usageTrack.find(
      t => t.limitKey === limitKey && t.period === period
    );
    const used = track?.used ?? 0;

    return { allowed: used < limit, used, limit };
  },

  // ── Increment usage (for periodic limits) ─────────────────────────────────
  incrementUsage: async (userId: string, limitKey: LimitKey) => {
    const prisma = getPrisma();

    const subscription = await subscriptionService.getActiveSubscription(userId);
    if (!subscription) return;

    const feature = subscription.plan.features.find(f => f.limitKey === limitKey);
    if (!feature || feature.limitValue === UNLIMITED || feature.resetPeriod === 'NEVER') return;

    const period = getCurrentPeriod(feature.resetPeriod);

    await prisma.usageTrack.upsert({
      where: { subscriptionId_limitKey_period: { subscriptionId: subscription.id, limitKey, period } },
      create: { subscriptionId: subscription.id, limitKey, used: 1, period },
      update: { used: { increment: 1 }, lastUsedAt: new Date() },
    });
  },

  // ── Upgrade subscription ───────────────────────────────────────────────────
  activateSubscription: async (
    userId: string,
    planSlug: string,
    razorpaySubscriptionId: string,
    billingCycle: 'MONTHLY' | 'YEARLY' = 'MONTHLY'
  ) => {
    const prisma = getPrisma();

    const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
    if (!plan) throw new Error('Plan not found');

    // Cancel existing active subscription
    await prisma.subscription.updateMany({
      where: { userId, status: { in: ['ACTIVE', 'TRIAL'] } },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'YEARLY') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    return prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: 'ACTIVE',
        billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        razorpaySubscriptionId,
      },
      include: { plan: { include: { features: true } } },
    });
  },

  // ── Cancel subscription → downgrade to free ────────────────────────────────
  cancelSubscription: async (userId: string) => {
    const prisma = getPrisma();

    await prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });

    await subscriptionService.assignFreePlan(userId);
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

async function countDirectUsage(prisma: ReturnType<typeof getPrisma>, userId: string, limitKey: LimitKey): Promise<number> {
  switch (limitKey) {
    case 'VOICE_CLONES':
      return prisma.botVoice.count({
        where: { bot: { userId, availableBotId: '3f0b66d8-b443-4804-92e0-cb8fa0812401' } },
      });
    case 'VOICE_CHATS':
      return prisma.chat.count({ where: { botVoice: { bot: { userId } } } });
    case 'AI_BOTS':
      return prisma.bot.count({ where: { userId, status: 'ACTIVE' } });
    default:
      return 0;
  }
}

function getCurrentPeriod(resetPeriod: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');

  switch (resetPeriod) {
    case 'DAILY':   return `${y}-${m}-${d}`;
    case 'WEEKLY': {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
    }
    case 'MONTHLY': return `${y}-${m}`;
    case 'YEARLY':  return `${y}`;
    default:        return `${y}-${m}`;
  }
}
