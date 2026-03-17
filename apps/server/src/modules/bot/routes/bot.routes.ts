import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { checkLimit } from '@middlewares/subscription.middleware.js';
import {
  getAvailableBots,
  createBot,
  getBots,
  getBotById,
  updateBot,
  deleteBot,
  updateBotCapability,
  addKnowledge,
  getKnowledge,
  deleteKnowledge,
  triggerTraining,
  getTrainings,
  updateBotConfig,
  updateBotRules,
} from '../controllers/bot.controller.js';
import {
  createBotChat,
  getBotChats,
  getBotChatById,
  deleteBotChat,
  sendBotMessage,
  getBotMessages,
  endBotSession,
} from '../controllers/botChat.controller.js';

const router = Router();

// All bot routes require auth
router.use(authMiddleware);

// ==========================================
// AVAILABLE BOTS (user sees active only)
// ==========================================
router.get('/available-bots', getAvailableBots);

// ==========================================
// BOT CRUD
// ==========================================
router.post('/', checkLimit('AI_BOTS'), createBot);
router.get('/', getBots);
router.get('/:botId', getBotById);
router.patch('/:botId', updateBot);
router.delete('/:botId', deleteBot);

// ==========================================
// BOT CAPABILITY (enable/disable)
// ==========================================
router.patch('/:botId/capability/:capabilityId', updateBotCapability);

// ==========================================
// KNOWLEDGE
// ==========================================
router.post('/:botId/knowledge', addKnowledge);
router.get('/:botId/knowledge', getKnowledge);
router.delete('/:botId/knowledge/:knowledgeId', deleteKnowledge);

// ==========================================
// TRAINING
// ==========================================
router.post('/:botId/train', triggerTraining);
router.get('/:botId/trainings', getTrainings);

// ==========================================
// CONFIG & RULES
// ==========================================
router.patch('/:botId/config', updateBotConfig);
router.patch('/:botId/rules', updateBotRules);

// ==========================================
// BOT CHATS
// ==========================================
router.post('/:botId/chats', createBotChat);
router.get('/:botId/chats', getBotChats);
router.get('/:botId/chats/:chatId', getBotChatById);
router.delete('/:botId/chats/:chatId', deleteBotChat);
router.post('/:botId/chats/:chatId/end', endBotSession);
router.post('/:botId/chats/:chatId/message', sendBotMessage);
router.get('/:botId/chats/:chatId/messages', getBotMessages);

export default router;
