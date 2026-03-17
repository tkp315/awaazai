import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { adminMiddleware } from '@middlewares/role.middleware.js';
import {
  createCapability,
  getAllCapabilities,
  getCapabilityById,
  updateCapability,
  deleteCapability,
  createCapabilityFunction,
  getCapabilityFunctions,
  updateCapabilityFunction,
  deleteCapabilityFunction,
  createAvailableBot,
  getAllAvailableBots,
  getAvailableBotById,
  updateAvailableBot,
  updateAvailableBotCapabilities,
  toggleAvailableBot,
  deleteAvailableBot,
} from '../controllers/adminBot.controller.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ==========================================
// CAPABILITY ROUTES
// ==========================================
router.post('/capabilities', createCapability);
router.get('/capabilities', getAllCapabilities);
router.get('/capabilities/:capabilityId', getCapabilityById);
router.patch('/capabilities/:capabilityId', updateCapability);
router.delete('/capabilities/:capabilityId', deleteCapability);

// ==========================================
// CAPABILITY FUNCTION ROUTES
// ==========================================
router.post('/capabilities/:capabilityId/functions', createCapabilityFunction);
router.get('/capabilities/:capabilityId/functions', getCapabilityFunctions);
router.patch('/capabilities/:capabilityId/functions/:functionId', updateCapabilityFunction);
router.delete('/capabilities/:capabilityId/functions/:functionId', deleteCapabilityFunction);

// ==========================================
// AVAILABLE BOT ROUTES
// ==========================================
router.post('/available-bots', createAvailableBot);
router.get('/available-bots', getAllAvailableBots);
router.get('/available-bots/:availableBotId', getAvailableBotById);
router.patch('/available-bots/:availableBotId', updateAvailableBot);
router.patch('/available-bots/:availableBotId/capabilities', updateAvailableBotCapabilities);
router.patch('/available-bots/:availableBotId/toggle', toggleAvailableBot);
router.delete('/available-bots/:availableBotId', deleteAvailableBot);

export default router;
