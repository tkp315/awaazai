import asyncHandler from '@utils/asyncHandler.js';
import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import { getPrisma } from '@lib/services/database/prisma/index.js';
import { getLogger } from '@lib/helper/logger/index.js';
import axios from 'axios';

// POST /notifications/token
export const registerToken = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { expoPushToken, deviceId } = req.body as { expoPushToken: string; deviceId?: string };
  if (!expoPushToken) throw new ApiError(400, 'expoPushToken is required');

  const prisma = getPrisma();

  // Upsert by deviceId if provided, else by userId
  if (deviceId) {
    await prisma.deviceToken.upsert({
      where: { deviceId },
      update: { fcmToken: expoPushToken, userId, status: 'ACTIVE' },
      create: { fcmToken: expoPushToken, userId, deviceId, status: 'ACTIVE' },
    });
  } else {
    // Upsert the first token for this user (simple approach)
    const existing = await prisma.deviceToken.findFirst({ where: { userId, status: 'ACTIVE' } });
    if (existing) {
      await prisma.deviceToken.update({
        where: { id: existing.id },
        data: { fcmToken: expoPushToken },
      });
    } else {
      await prisma.deviceToken.create({
        data: { fcmToken: expoPushToken, userId, status: 'ACTIVE' },
      });
    }
  }

  return res.status(200).json(new ApiResponse(200, 'Push token registered', {}, {}));
});

// Utility: send Expo push notification to a user
export async function sendPushToUser(
  userId: string,
  notification: { title: string; body: string; data?: Record<string, unknown> }
): Promise<void> {
  const logger = getLogger();
  const prisma = getPrisma();

  const tokens = await prisma.deviceToken.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { fcmToken: true },
  });

  if (!tokens.length) return;

  const messages = tokens.map(t => ({
    to: t.fcmToken,
    sound: 'default',
    title: notification.title,
    body: notification.body,
    data: notification.data ?? {},
  }));

  try {
    await axios.post('https://exp.host/--/api/v2/push/send', messages, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    logger.info(`[PUSH] Sent to userId: ${userId}`, { count: tokens.length });
  } catch (err) {
    logger.error(`[PUSH] Failed to send to userId: ${userId}`, { error: (err as Error).message });
  }
}
