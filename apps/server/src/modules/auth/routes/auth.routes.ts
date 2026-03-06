import { Router } from 'express';
import {
  signup,
  login,
  logout,
  sendOtp,
  verifyOtp,
  resetPassword,
  refreshToken,
  googleLogin,
  guestLogin,
} from '../controllers/auth.cotroller.js';
import { authMiddleware } from '@middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);
router.post('/guest', guestLogin);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.post('/refresh-token', authMiddleware, refreshToken);

export default router;
