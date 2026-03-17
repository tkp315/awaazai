import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/role.middleware.js';
import {
  adminGetPlans,
  adminGetPlanById,
  adminCreatePlan,
  adminUpdatePlan,
  adminDeletePlan,
  adminTogglePlan,
  adminGetSubscriptions,
  adminGetSubscriptionById,
  adminGrantSubscription,
  adminCancelSubscription,
  adminGetStats,
} from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require auth + ADMIN role
router.use(authMiddleware, adminMiddleware);

// ── Plan CRUD ─────────────────────────────────────────────────────────────────
router.get('/plans',                adminGetPlans);
router.get('/plans/:planId',        adminGetPlanById);
router.post('/plans',               adminCreatePlan);
router.patch('/plans/:planId',      adminUpdatePlan);
router.delete('/plans/:planId',     adminDeletePlan);
router.patch('/plans/:planId/toggle', adminTogglePlan);

// ── Subscription Management ───────────────────────────────────────────────────
router.get('/subscriptions/stats',                        adminGetStats);
router.get('/subscriptions',                              adminGetSubscriptions);
router.get('/subscriptions/:subscriptionId',              adminGetSubscriptionById);
router.post('/subscriptions/grant',                       adminGrantSubscription);
router.post('/subscriptions/:subscriptionId/cancel',      adminCancelSubscription);

export default router;
