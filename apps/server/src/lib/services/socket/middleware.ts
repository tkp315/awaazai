import ApiError from '@utils/apiError.js';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../database/prisma/index.js';
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ApiError) => void
): Promise<void> => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new ApiError(401, 'Unauthorized:No token'));
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };

    const prisma = getPrisma();

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return next(new ApiError(401, 'Unauthorized: User not found'));
    }
    socket.data.userId = user.id;
    next();
  } catch (error) {
    next(new ApiError(404, 'Unauthorized: Invalid token'));
  }
};
