import { Router } from 'express';
import authRoutes from '@modules/auth/routes/auth.routes.js';
import profileRoutes from '@modules/auth/routes/profile.routes.js';
import botRoutes from '@modules/bot/routes/bot.routes.js';
import adminBotRoutes from '@modules/bot/routes/adminBot.routes.js';
import voiceRoutes from '@modules/voice/routes/voice.route.js';
import chatRoutes from '@modules/chat/routes/chat.route.js';
import subscriptionRoutes from '@modules/subscription/routes/subscription.routes.js';
import adminSubscriptionRoutes from '@modules/subscription/routes/admin.routes.js';
import notificationRoutes from '@modules/notification/routes/notification.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/bots', botRoutes);
router.use('/admin', adminBotRoutes);
router.use('/voices', voiceRoutes);
router.use('/chats', chatRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/admin', adminSubscriptionRoutes);
router.use('/notifications', notificationRoutes);

export default router;
