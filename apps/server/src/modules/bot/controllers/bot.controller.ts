import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import asyncHandler from '@utils/asyncHandler.js';
import {
  createBotSchema,
  updateBotSchema,
  addKnowledgeSchema,
  triggerTrainingSchema,
  updateBotConfigSchema,
  updateBotRulesSchema,
  updateBotCapabilitySchema,
  botListQuerySchema,
  knowledgeListQuerySchema,
  trainingListQuerySchema,
} from '../validators/bot.validation.js';
import { botService } from '../services/bot.service.js';

// ==========================================
// AVAILABLE BOTS (User - read only)
// ==========================================

// GET /api/v1/available-bots
export const getAvailableBots = asyncHandler(async (req, res) => {
  const bots = await botService.getAvailableBots();
  return res
    .status(200)
    .json(new ApiResponse(200, 'Available bots fetched successfully', bots, {}));
});

// ==========================================
// BOT CRUD
// ==========================================

// POST /api/v1/bots
export const createBot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { success, data, error } = createBotSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  // Check availableBot exists and is active
  const availableBot = await botService.getActiveAvailableBot(data.availableBotId);
  if (!availableBot) throw new ApiError(404, 'Bot type not found or inactive');

  const bot = await botService.createBot(userId, data, availableBot);
  return res.status(201).json(new ApiResponse(201, 'Bot created successfully', bot, {}));
});

// GET /api/v1/bots
export const getBots = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { success, data, error } = botListQuerySchema.safeParse(req.query);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bots = await botService.getBots(userId, data);
  return res.status(200).json(new ApiResponse(200, 'Bots fetched successfully', bots, {}));
});

// GET /api/v1/bots/:botId
export const getBotById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  return res.status(200).json(new ApiResponse(200, 'Bot fetched successfully', bot, {}));
});

// PATCH /api/v1/bots/:botId
export const updateBot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = updateBotSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const existing = await botService.getBotById(botId as string, userId);
  if (!existing) throw new ApiError(404, 'Bot not found');

  const bot = await botService.updateBot(botId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Bot updated successfully', bot, {}));
});

// DELETE /api/v1/bots/:botId
export const deleteBot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const existing = await botService.getBotById(botId as string, userId);
  if (!existing) throw new ApiError(404, 'Bot not found');

  await botService.deleteBot(botId as string);
  return res.status(200).json(new ApiResponse(200, 'Bot deleted successfully', {}, {}));
});

// ==========================================
// BOT CAPABILITY (enable/disable)
// ==========================================

// PATCH /api/v1/bots/:botId/capability/:capabilityId
export const updateBotCapability = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId, capabilityId } = req.params;

  const { success, data, error } = updateBotCapabilitySchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const botCapability = await botService.updateBotCapability(
    botId as string,
    capabilityId as string,
    data
  );
  if (!botCapability) throw new ApiError(404, 'Capability not found on this bot');

  return res
    .status(200)
    .json(new ApiResponse(200, 'Capability updated successfully', botCapability, {}));
});

// ==========================================
// KNOWLEDGE
// ==========================================

// POST /api/v1/bots/:botId/knowledge
export const addKnowledge = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = addKnowledgeSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const knowledge = await botService.addKnowledge(botId as string, data);
  return res.status(201).json(new ApiResponse(201, 'Knowledge added successfully', knowledge, {}));
});

// GET /api/v1/bots/:botId/knowledge
export const getKnowledge = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = knowledgeListQuerySchema.safeParse(req.query);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const knowledge = await botService.getKnowledge(botId as string, data);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Knowledge fetched successfully', knowledge, {}));
});

// DELETE /api/v1/bots/:botId/knowledge/:knowledgeId
export const deleteKnowledge = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId, knowledgeId } = req.params;

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const existing = await botService.getKnowledgeById(knowledgeId as string, botId as string);
  if (!existing) throw new ApiError(404, 'Knowledge item not found');

  await botService.deleteKnowledge(knowledgeId as string);
  return res.status(200).json(new ApiResponse(200, 'Knowledge deleted successfully', {}, {}));
});

// ==========================================
// TRAINING
// ==========================================

// POST /api/v1/bots/:botId/train
export const triggerTraining = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = triggerTrainingSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  // Check if training already in progress
  const inProgress = await botService.hasActiveTraining(botId as string);
  if (inProgress) throw new ApiError(409, 'Training already in progress for this bot');

  const training = await botService.triggerTraining(botId as string, data.capabilityId);
  return res.status(201).json(new ApiResponse(201, 'Training started successfully', training, {}));
});

// GET /api/v1/bots/:botId/trainings
export const getTrainings = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = trainingListQuerySchema.safeParse(req.query);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const trainings = await botService.getTrainings(botId as string, data);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Trainings fetched successfully', trainings, {}));
});

// ==========================================
// BOT CONFIG & RULES
// ==========================================

// PATCH /api/v1/bots/:botId/config
export const updateBotConfig = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = updateBotConfigSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const config = await botService.upsertBotConfig(botId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Bot config saved successfully', config, {}));
});

// PATCH /api/v1/bots/:botId/rules
export const updateBotRules = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = updateBotRulesSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await botService.getBotById(botId as string, userId);
  if (!bot) throw new ApiError(404, 'Bot not found');

  const rules = await botService.upsertBotRules(botId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Bot rules saved successfully', rules, {}));
});
