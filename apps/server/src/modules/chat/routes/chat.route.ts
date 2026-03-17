import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { checkLimit } from '@middlewares/subscription.middleware.js';
import {
  createChat,
  getAllChats,
  getChatById,
  deleteChat,
  startSession,
  endSession,
  getSessionMessages,
} from '../controllers/chat.controller.js';

const router = Router();

router.use(authMiddleware);

// ─── Chat ─────────────────────────────────────────────────────────────────────
router.post('/', checkLimit('VOICE_CHATS'), createChat);
router.get('/', getAllChats);
router.get('/:chatId', getChatById);
router.delete('/:chatId', deleteChat);

// ─── Session ──────────────────────────────────────────────────────────────────
router.post('/:chatId/sessions', startSession);
router.patch('/:chatId/sessions/:sessionId/end', endSession);
router.get('/:chatId/sessions/:sessionId/messages', getSessionMessages);

export default router;
