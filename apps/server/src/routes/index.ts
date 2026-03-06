import { Router } from 'express';
import authRoutes from '@modules/auth/routes/auth.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Module routes
router.use('/auth', authRoutes); 

export default router;
