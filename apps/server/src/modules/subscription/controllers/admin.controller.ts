import type { Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '@lib/services/database/prisma/index.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { PlanType, Currency } from 'generated/prisma/client.js';

// ── Validators ────────────────────────────────────────────────────────────────

const featureSchema = z.object({
  name:        z.string().min(1),
  description: z.string().optional(),
  limitKey:    z.enum(['VOICE_CLONES', 'VOICE_CHATS', 'AI_BOTS']),
  limitValue:  z.number().int().min(-1),
  resetPeriod: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NEVER']).default('NEVER'),
});

const createPlanSchema = z.object({
  name:         z.string().min(1).max(50),
  slug:         z.string().min(1).max(30).regex(/^[a-z0-9-]+$/),
  type:         z.enum(['FREE', 'PAID', 'ENTERPRISE']).default('PAID'),
  monthlyPrice: z.number().min(0),
  yearlyPrice:  z.number().min(0),
  currency:     z.enum(['INR', 'USD']).default('INR'),
  description:  z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive:     z.boolean().default(true),
  features:     z.array(featureSchema).min(1),
});

const updatePlanSchema = createPlanSchema.partial().omit({ slug: true });

// helper to safely extract a string param (Express 5 types params as string | string[])
const param = (req: Request, key: string): string => String((req.params as Record<string, string | string[]>)[key] ?? '');

// ── GET /admin/plans ──────────────────────────────────────────────────────────

export async function adminGetPlans(req: Request, res: Response): Promise<void> {
  const prisma = getPrisma();
  const plans = await prisma.plan.findMany({
    include: { features: true },
    orderBy: { displayOrder: 'asc' },
  });

  // Attach subscriber counts
  const counts = await Promise.all(
    plans.map(p => prisma.subscription.count({ where: { planId: p.id, status: { in: ['ACTIVE', 'TRIAL'] } } }))
  );

  res.json({ success: true, data: plans.map((p, i) => ({ ...p, subscriberCount: counts[i] })) });
}

// ── GET /admin/plans/:planId ──────────────────────────────────────────────────

export async function adminGetPlanById(req: Request, res: Response): Promise<void> {
  const planId = param(req, 'planId');
  const prisma = getPrisma();

  const plan = await prisma.plan.findUnique({ where: { id: planId }, include: { features: true } });
  if (!plan) { res.status(404).json({ message: 'Plan not found' }); return; }

  const subscriberCount = await prisma.subscription.count({ where: { planId, status: { in: ['ACTIVE', 'TRIAL'] } } });
  res.json({ success: true, data: { ...plan, subscriberCount } });
}

// ── POST /admin/plans ─────────────────────────────────────────────────────────

export async function adminCreatePlan(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const parsed = createPlanSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues }); return; }

  const { features, ...planData } = parsed.data;
  const prisma = getPrisma();

  const existing = await prisma.plan.findUnique({ where: { slug: planData.slug } });
  if (existing) { res.status(409).json({ message: `Plan with slug '${planData.slug}' already exists` }); return; }

  const plan = await prisma.plan.create({
    data: {
      ...planData,
      type: planData.type as PlanType,
      currency: planData.currency as Currency,
      features: { create: features },
    },
    include: { features: true },
  });

  logger.info('[ADMIN] Plan created', { planId: plan.id, slug: plan.slug });
  res.status(201).json({ success: true, data: plan });
}

// ── PATCH /admin/plans/:planId ────────────────────────────────────────────────

export async function adminUpdatePlan(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const planId = param(req, 'planId');
  const parsed = updatePlanSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues }); return; }

  const { features, ...planData } = parsed.data;
  const prisma = getPrisma();

  const existing = await prisma.plan.findUnique({ where: { id: planId } });
  if (!existing) { res.status(404).json({ message: 'Plan not found' }); return; }

  const updated = await prisma.$transaction(async tx => {
    const { type: rawType, currency: rawCurrency, ...restPlanData } = planData;
    const updatedPlan = await tx.plan.update({
      where: { id: planId },
      data: {
        ...restPlanData,
        ...(rawType && { type: rawType as PlanType }),
        ...(rawCurrency && { currency: rawCurrency as Currency }),
      },
    });

    if (features && features.length > 0) {
      await tx.planFeature.deleteMany({ where: { planId } });
      await tx.planFeature.createMany({ data: features.map(f => ({ ...f, planId })) });
    }

    return tx.plan.findUnique({ where: { id: planId }, include: { features: true } });
  });

  logger.info('[ADMIN] Plan updated', { planId });
  res.json({ success: true, data: updated });
}

// ── DELETE /admin/plans/:planId ───────────────────────────────────────────────

export async function adminDeletePlan(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const planId = param(req, 'planId');
  const prisma = getPrisma();

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) { res.status(404).json({ message: 'Plan not found' }); return; }

  const subscriberCount = await prisma.subscription.count({ where: { planId, status: { in: ['ACTIVE', 'TRIAL'] } } });
  if (subscriberCount > 0) {
    res.status(409).json({ message: `Cannot delete plan with ${subscriberCount} active subscriber(s). Deactivate it instead.` });
    return;
  }

  await prisma.plan.delete({ where: { id: planId } });
  logger.info('[ADMIN] Plan deleted', { planId, slug: plan.slug });
  res.json({ success: true, message: 'Plan deleted' });
}

// ── PATCH /admin/plans/:planId/toggle ────────────────────────────────────────

export async function adminTogglePlan(req: Request, res: Response): Promise<void> {
  const planId = param(req, 'planId');
  const prisma = getPrisma();

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) { res.status(404).json({ message: 'Plan not found' }); return; }

  const updated = await prisma.plan.update({ where: { id: planId }, data: { isActive: !plan.isActive } });
  res.json({ success: true, data: { id: updated.id, isActive: updated.isActive } });
}

// ── GET /admin/subscriptions ──────────────────────────────────────────────────

export async function adminGetSubscriptions(req: Request, res: Response): Promise<void> {
  const prisma = getPrisma();
  const page   = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit  = Math.min(50, parseInt(req.query.limit as string) || 20);
  const status = req.query.status as string | undefined;
  const planId = req.query.planId as string | undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (planId) where.planId = planId;

  const [total, subscriptions] = await Promise.all([
    prisma.subscription.count({ where }),
    prisma.subscription.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        plan: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({ success: true, data: subscriptions, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

// ── GET /admin/subscriptions/:subscriptionId ──────────────────────────────────

export async function adminGetSubscriptionById(req: Request, res: Response): Promise<void> {
  const subscriptionId = param(req, 'subscriptionId');
  const prisma = getPrisma();

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user:       { select: { id: true, fullName: true, email: true } },
      plan:       { include: { features: true } },
      payments:   { orderBy: { createdAt: 'desc' }, take: 10 },
      usageTrack: { orderBy: { period: 'desc' } },
    },
  });

  if (!subscription) { res.status(404).json({ message: 'Subscription not found' }); return; }
  res.json({ success: true, data: subscription });
}

// ── POST /admin/subscriptions/grant ──────────────────────────────────────────

const grantSchema = z.object({
  userId:       z.string().uuid(),
  planSlug:     z.string(),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
  durationDays: z.number().int().min(1).default(30),
});

export async function adminGrantSubscription(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const parsed = grantSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues }); return; }

  const { userId, planSlug, billingCycle, durationDays } = parsed.data;
  const prisma = getPrisma();

  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan) { res.status(404).json({ message: 'Plan not found' }); return; }

  await prisma.subscription.updateMany({
    where: { userId, status: { in: ['ACTIVE', 'TRIAL'] } },
    data:  { status: 'CANCELLED', cancelledAt: new Date() },
  });

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + durationDays);

  const subscription = await prisma.subscription.create({
    data: { userId, planId: plan.id, status: 'ACTIVE', billingCycle, currentPeriodStart: now, currentPeriodEnd: periodEnd },
    include: { plan: { include: { features: true } } },
  });

  logger.info('[ADMIN] Subscription granted', { userId, planSlug, durationDays, grantedBy: (req as any).user?.id });
  res.status(201).json({ success: true, data: subscription });
}

// ── POST /admin/subscriptions/:subscriptionId/cancel ─────────────────────────

export async function adminCancelSubscription(req: Request, res: Response): Promise<void> {
  const logger = getLogger();
  const subscriptionId = param(req, 'subscriptionId');
  const prisma = getPrisma();

  const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!subscription) { res.status(404).json({ message: 'Subscription not found' }); return; }

  await prisma.subscription.update({ where: { id: subscriptionId }, data: { status: 'CANCELLED', cancelledAt: new Date() } });

  logger.info('[ADMIN] Subscription cancelled', { subscriptionId, cancelledBy: (req as any).user?.id });
  res.json({ success: true, message: 'Subscription cancelled' });
}

// ── GET /admin/subscriptions/stats ───────────────────────────────────────────

export async function adminGetStats(req: Request, res: Response): Promise<void> {
  const prisma = getPrisma();

  const [totalActive, totalTrial, totalCancelled, revenueResult, planBreakdown] = await Promise.all([
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { status: 'TRIAL' } }),
    prisma.subscription.count({ where: { status: 'CANCELLED' } }),
    prisma.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
    prisma.subscription.groupBy({ by: ['planId'], where: { status: { in: ['ACTIVE', 'TRIAL'] } }, _count: { _all: true } }),
  ]);

  const planIds = planBreakdown.map(p => p.planId);
  const plans   = await prisma.plan.findMany({ where: { id: { in: planIds } }, select: { id: true, name: true, slug: true } });
  const planMap = Object.fromEntries(plans.map(p => [p.id, p]));

  res.json({
    success: true,
    data: {
      subscriptions: { active: totalActive, trial: totalTrial, cancelled: totalCancelled, total: totalActive + totalTrial + totalCancelled },
      revenue: { total: Number(revenueResult._sum.amount ?? 0) },
      byPlan: planBreakdown.map(p => ({
        plan:  planMap[p.planId] ?? { id: p.planId, name: 'Unknown', slug: '' },
        count: p._count._all,
      })),
    },
  });
}
