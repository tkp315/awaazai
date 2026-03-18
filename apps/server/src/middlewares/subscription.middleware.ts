import type { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '@modules/subscription/services/subscription.service.js';
import { getPrisma } from '@lib/services/database/prisma/index.js';
import type { LimitKey } from 'generated/prisma/client.js';

export function checkLimit(limitKey: LimitKey) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Admins bypass all plan limits
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role === 'ADMIN') {
      next();
      return;
    }

    const { allowed, used, limit } = await subscriptionService.checkLimit(userId, limitKey);

    if (!allowed) {
      res.status(403).json({
        message: 'Plan limit reached',
        code: 'LIMIT_REACHED',
        limitKey,
        used,
        limit,
      });
      return;
    }

    next();
  };
}
