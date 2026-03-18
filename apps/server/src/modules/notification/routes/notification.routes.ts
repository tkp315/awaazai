import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { registerToken } from '../controllers/notification.controller.js';

const router = Router();

router.post('/token', authMiddleware, registerToken);

export default router;
