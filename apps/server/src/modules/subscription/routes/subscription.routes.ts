import { Router } from 'express';
import { authMiddleware as authenticate } from '@middlewares/auth.middleware.js';
import {
  getMySubscription,
  getPlans,
  createOrder,
  verifyPayment,
  cancelSubscription,
  getMyLimits,
  getMyUsage,
  getMyPayments,
} from '../controllers/subscription.controller.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMySubscription);
router.get('/plans', getPlans);
router.get('/limits', getMyLimits);
router.get('/usage', getMyUsage);
router.get('/payments', getMyPayments);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/cancel', cancelSubscription);

export default router;
