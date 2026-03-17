import asyncHandler from '@utils/asyncHandler.js';
import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import { chatService } from '../services/chat.service.js';
import { createChatSchema, endSessionSchema } from '../validators/chat.validation.js';

// ─── Chat ─────────────────────────────────────────────────────────────────────

// POST /api/chats
export const createChat = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { success, data, error } = createChatSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const chat = await chatService.createChat(userId, data);
  return res.status(201).json(new ApiResponse(201, 'Chat created', chat, {}));
});

// GET /api/chats
export const getAllChats = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const chats = await chatService.getAllChats(userId);
  return res.status(200).json(new ApiResponse(200, 'Chats fetched', chats, {}));
});

// GET /api/chats/:chatId
export const getChatById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;
  const chat = await chatService.getChatById(chatId as string, userId);
  if (!chat) throw new ApiError(404, 'Chat not found');

  return res.status(200).json(new ApiResponse(200, 'Chat fetched', chat, {}));
});

// DELETE /api/chats/:chatId
export const deleteChat = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;
  await chatService.deleteChat(chatId as string, userId);

  return res.status(200).json(new ApiResponse(200, 'Chat deleted', {}, {}));
});

// ─── Session ──────────────────────────────────────────────────────────────────

// POST /api/chats/:chatId/sessions
export const startSession = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId } = req.params;
  const session = await chatService.startSession(chatId as string, userId);

  return res.status(201).json(new ApiResponse(201, 'Session started', session, {}));
});

// PATCH /api/chats/:chatId/sessions/:sessionId/end
export const endSession = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId, sessionId } = req.params;

  const { success, data, error } = endSessionSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const session = await chatService.endSession(chatId as string, sessionId as string, userId, data);

  return res.status(200).json(new ApiResponse(200, 'Session ended', session, {}));
});

// GET /api/chats/:chatId/sessions/:sessionId/messages
export const getSessionMessages = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { chatId, sessionId } = req.params;
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const before = req.query.before as string | undefined;

  const messages = await chatService.getSessionMessages(
    chatId as string,
    sessionId as string,
    userId,
    limit,
    before
  );

  return res.status(200).json(new ApiResponse(200, 'Messages fetched', messages, {}));
});
