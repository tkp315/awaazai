import { Request, Response, NextFunction } from 'express';
import { getPrisma } from '@lib/services/database/prisma/index.js';
import ApiError from '@utils/apiError.js';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ApiError(403, 'Access denied: Admins only');
    }

    next();
  } catch (error) {
    next(error);
  }
};
