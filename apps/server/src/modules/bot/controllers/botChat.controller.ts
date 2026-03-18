import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import asyncHandler from '@utils/asyncHandler.js';
import {
  createBotChatSchema,
  sendBotMessageSchema,
  botChatListQuerySchema,
  botMessageListQuerySchema,
} from '../validators/bot.validation.js';
import { botService } from '../services/bot.service.js';
import { botChatService } from '../types/botChat.service.js';

// ==========================================
// BOT CHAT CRUD
// ==========================================

// POST /api/v1/bots/:botId/chats
export const createBotChat = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = createBotChatSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const chat = await botChatService.createChat(userId, botId as string, data);
  return res.status(201).json(new ApiResponse(201, 'Chat created successfully', chat, {}));
});

// GET /api/v1/bots/:botId/chats
export const getBotChats = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = botChatListQuerySchema.safeParse(req.query);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const result = await botChatService.getChats(userId, botId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Chats fetched successfully', result, {}));
});

// GET /api/v1/bots/:botId/chats/:chatId
export const getBotChatById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;

  const chat = await botChatService.getChatById(chatId as string, userId);
  if (!chat) throw new ApiError(404, 'Chat not found');

  return res.status(200).json(new ApiResponse(200, 'Chat fetched successfully', chat, {}));
});

// DELETE /api/v1/bots/:botId/chats/:chatId
export const deleteBotChat = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;

  const chat = await botChatService.getChatById(chatId as string, userId);
  if (!chat) throw new ApiError(404, 'Chat not found');

  await botChatService.deleteChat(chatId as string);
  return res.status(200).json(new ApiResponse(200, 'Chat deleted successfully', {}, {}));
});

// ==========================================
// SESSION
// ==========================================

// POST /api/v1/bots/:botId/chats/:chatId/end
export const endBotSession = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;

  const session = await botChatService.endSession(chatId as string, userId);
  if (!session) throw new ApiError(404, 'No active session found');

  return res.status(200).json(new ApiResponse(200, 'Session ended successfully', session, {}));
});

// ==========================================
// MESSAGES
// ==========================================

// POST /api/v1/bots/:botId/chats/:chatId/message
export const sendBotMessage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId, chatId } = req.params;

  const { success, data, error } = sendBotMessageSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const chat = await botChatService.getChatById(chatId as string, userId);
  if (!chat) throw new ApiError(404, 'Chat not found');

  const result = await botChatService.sendMessage(botId as string, chatId as string, userId, data);
  return res.status(200).json(new ApiResponse(200, 'Message sent successfully', result, {}));
});

// GET /api/v1/bots/:botId/chats/:chatId/messages
export const getBotMessages = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;

  const { success, data, error } = botMessageListQuerySchema.safeParse(req.query);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const messages = await botChatService.getMessages(chatId as string, userId, data);
  if (messages === null) throw new ApiError(404, 'Chat not found');

  return res.status(200).json(new ApiResponse(200, 'Messages fetched successfully', messages, {}));
});
