import { Request, Response, NextFunction } from 'express';
import { authHelpers } from '@modules/auth/helpers/auth.helper.js';
import ApiError from '@utils/apiError.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Access token required');
    }

    const { valid, payload } = authHelpers.verifyToken(false, token);

    if (!valid || !payload) {
      throw new ApiError(401, 'Invalid or expired token');
    }
   console.log("Payload",payload)
    req.user = payload as { id: string;};
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const { valid, payload } = authHelpers.verifyToken(false, token);
      if (valid && payload) {
        req.user = payload as { id: string; email?: string; name?: string };
      }
    }
    next();
  } catch (error) {
    next();
  }
};
