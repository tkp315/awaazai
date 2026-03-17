import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.dev') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    type: 'INDIVIDUAL' as const,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with 1 voice clone and basic features',
    displayOrder: 0,
    features: [
      { name: 'Voice Clones', limitKey: 'VOICE_CLONES' as const, limitValue: 1, resetPeriod: 'NEVER' as const },
      { name: 'Voice Chats', limitKey: 'VOICE_CHATS' as const, limitValue: 5, resetPeriod: 'NEVER' as const },
      { name: 'AI Bots', limitKey: 'AI_BOTS' as const, limitValue: 1, resetPeriod: 'NEVER' as const },
    ],
  },
  {
    name: 'Starter',
    slug: 'starter',
    type: 'INDIVIDUAL' as const,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    description: '3 voice clones, unlimited chats, and 2 AI bots',
    displayOrder: 1,
    features: [
      { name: 'Voice Clones', limitKey: 'VOICE_CLONES' as const, limitValue: 3, resetPeriod: 'NEVER' as const },
      { name: 'Voice Chats', limitKey: 'VOICE_CHATS' as const, limitValue: -1, resetPeriod: 'NEVER' as const },
      { name: 'AI Bots', limitKey: 'AI_BOTS' as const, limitValue: 2, resetPeriod: 'NEVER' as const },
    ],
  },
  {
    name: 'Pro',
    slug: 'pro',
    type: 'INDIVIDUAL' as const,
    monthlyPrice: 499,
    yearlyPrice: 4990,
    description: '5 voice clones, unlimited chats, unlimited bots + TTS',
    displayOrder: 2,
    features: [
      { name: 'Voice Clones', limitKey: 'VOICE_CLONES' as const, limitValue: 5, resetPeriod: 'NEVER' as const },
      { name: 'Voice Chats', limitKey: 'VOICE_CHATS' as const, limitValue: -1, resetPeriod: 'NEVER' as const },
      { name: 'AI Bots', limitKey: 'AI_BOTS' as const, limitValue: -1, resetPeriod: 'NEVER' as const },
    ],
  },
];

async function main() {
  console.log('Seeding plans...');

  for (const plan of PLANS) {
    const { features, ...planData } = plan;

    const existing = await prisma.plan.findUnique({ where: { slug: planData.slug } });

    if (existing) {
      await prisma.plan.update({
        where: { slug: planData.slug },
        data: {
          ...planData,
          features: {
            deleteMany: {},
            create: features.map(f => ({
              name: f.name,
              limitKey: f.limitKey,
              limitValue: f.limitValue,
              resetPeriod: f.resetPeriod,
            })),
          },
        },
      });
      console.log(`Updated: ${planData.name}`);
    } else {
      await prisma.plan.create({
        data: {
          ...planData,
          features: {
            create: features.map(f => ({
              name: f.name,
              limitKey: f.limitKey,
              limitValue: f.limitValue,
              resetPeriod: f.resetPeriod,
            })),
          },
        },
      });
      console.log(`Created: ${planData.name}`);
    }
  }

  console.log('Done.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
