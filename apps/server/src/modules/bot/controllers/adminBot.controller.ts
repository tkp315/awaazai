import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import asyncHandler from '@utils/asyncHandler.js';
import {
  createCapabilitySchema,
  updateCapabilitySchema,
  createCapabilityFunctionSchema,
  updateCapabilityFunctionSchema,
  createAvailableBotSchema,
  updateAvailableBotSchema,
  updateAvailableBotCapabilitiesSchema
} from '../validators/bot.validation.js';
import { adminBotService } from '../services/adminBot.service.js';

// ==========================================
// CAPABILITY
// ==========================================

// POST /api/v1/admin/capabilities
export const createCapability = asyncHandler(async (req, res) => {
  const { success, data, error } = createCapabilitySchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const capability = await adminBotService.createCapability(data);
  return res.status(201).json(new ApiResponse(201, 'Capability created successfully', capability, {}));
});

// GET /api/v1/admin/capabilities
export const getAllCapabilities = asyncHandler(async (_req, res) => {
  const capabilities = await adminBotService.getAllCapabilities();
  return res.status(200).json(new ApiResponse(200, 'Capabilities fetched successfully', capabilities, {}));
});

// GET /api/v1/admin/capabilities/:capabilityId
export const getCapabilityById = asyncHandler(async (req, res) => {
  const { capabilityId } = req.params;
  const capability = await adminBotService.getCapabilityById(capabilityId as string);
  if (!capability) throw new ApiError(404, 'Capability not found');
  return res.status(200).json(new ApiResponse(200, 'Capability fetched successfully', capability, {}));
});

// PATCH /api/v1/admin/capabilities/:capabilityId
export const updateCapability = asyncHandler(async (req, res) => {
  const { capabilityId } = req.params;
  const { success, data, error } = updateCapabilitySchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const existing = await adminBotService.getCapabilityById(capabilityId as string);
  if (!existing) throw new ApiError(404, 'Capability not found');

  const capability = await adminBotService.updateCapability(capabilityId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Capability updated successfully', capability, {}));
});

// DELETE /api/v1/admin/capabilities/:capabilityId
export const deleteCapability = asyncHandler(async (req, res) => {
  const { capabilityId } = req.params;

  const existing = await adminBotService.getCapabilityById(capabilityId as string);
  if (!existing) throw new ApiError(404, 'Capability not found');

  await adminBotService.deleteCapability(capabilityId as string);
  return res.status(200).json(new ApiResponse(200, 'Capability deleted successfully', {}, {}));
});

// ==========================================
// CAPABILITY FUNCTION
// ==========================================

// POST /api/v1/admin/capabilities/:capabilityId/functions
export const createCapabilityFunction = asyncHandler(async (req, res) => {
  const { capabilityId } = req.params;
  const { success, data, error } = createCapabilityFunctionSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const capability = await adminBotService.getCapabilityById(capabilityId as string);
  if (!capability) throw new ApiError(404, 'Capability not found');

  const fn = await adminBotService.createCapabilityFunction(capabilityId as string, data);
  return res.status(201).json(new ApiResponse(201, 'Capability function created successfully', fn, {}));
});

// GET /api/v1/admin/capabilities/:capabilityId/functions
export const getCapabilityFunctions = asyncHandler(async (req, res) => {
  const { capabilityId } = req.params;

  const capability = await adminBotService.getCapabilityById(capabilityId as string);
  if (!capability) throw new ApiError(404, 'Capability not found');

  const functions = await adminBotService.getCapabilityFunctions(capabilityId as string);
  return res.status(200).json(new ApiResponse(200, 'Capability functions fetched successfully', functions, {}));
});

// PATCH /api/v1/admin/capabilities/:capabilityId/functions/:functionId
export const updateCapabilityFunction = asyncHandler(async (req, res) => {
  const { capabilityId, functionId } = req.params;
  const { success, data, error } = updateCapabilityFunctionSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const existing = await adminBotService.getCapabilityFunctionById(functionId as string);
  if (!existing) throw new ApiError(404, 'Capability function not found');

  const fn = await adminBotService.updateCapabilityFunction(functionId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Capability function updated successfully', fn, {}));
});

// DELETE /api/v1/admin/capabilities/:capabilityId/functions/:functionId
export const deleteCapabilityFunction = asyncHandler(async (req, res) => {
  const { capabilityId, functionId } = req.params;

  const existing = await adminBotService.getCapabilityFunctionById(functionId as string);
  if (!existing) throw new ApiError(404, 'Capability function not found');

  await adminBotService.deleteCapabilityFunction(functionId as string);
  return res.status(200).json(new ApiResponse(200, 'Capability function deleted successfully', {}, {}));
});

// ==========================================
// AVAILABLE BOTS
// ==========================================

// POST /api/v1/admin/available-bots
export const createAvailableBot = asyncHandler(async (req, res) => {
  const { success, data, error } = createAvailableBotSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const bot = await adminBotService.createAvailableBot(data);
  return res.status(201).json(new ApiResponse(201, 'Available bot created successfully', bot, {}));
});

// GET /api/v1/admin/available-bots
export const getAllAvailableBots = asyncHandler(async (_req, res) => {
  const bots = await adminBotService.getAllAvailableBots();
  return res.status(200).json(new ApiResponse(200, 'Available bots fetched successfully', bots, {}));
});

// GET /api/v1/admin/available-bots/:availableBotId
export const getAvailableBotById = asyncHandler(async (req, res) => {
  const { availableBotId } = req.params;
  const bot = await adminBotService.getAvailableBotById(availableBotId as string);
  if (!bot) throw new ApiError(404, 'Available bot not found');
  return res.status(200).json(new ApiResponse(200, 'Available bot fetched successfully', bot, {}));
});

// PATCH /api/v1/admin/available-bots/:availableBotId
export const updateAvailableBot = asyncHandler(async (req, res) => {
  const { availableBotId } = req.params;
  const { success, data, error } = updateAvailableBotSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const existing = await adminBotService.getAvailableBotById(availableBotId as string);
  if (!existing) throw new ApiError(404, 'Available bot not found');

  const bot = await adminBotService.updateAvailableBot(availableBotId as string, data);
  return res.status(200).json(new ApiResponse(200, 'Available bot updated successfully', bot, {}));
});

// PATCH /api/v1/admin/available-bots/:availableBotId/capabilities
export const updateAvailableBotCapabilities = asyncHandler(async (req, res) => {
  const { availableBotId } = req.params;
  const { success, data, error } =  updateAvailableBotCapabilitiesSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const existing = await adminBotService.getAvailableBotById(availableBotId as string);
  if (!existing) throw new ApiError(404, 'Available bot not found');

  const bot = await adminBotService.syncAvailableBotCapabilities(availableBotId as string, data.capabilityIds);
  return res.status(200).json(new ApiResponse(200, 'Available bot capabilities updated successfully', bot, {}));
});

// PATCH /api/v1/admin/available-bots/:availableBotId/toggle
export const toggleAvailableBot = asyncHandler(async (req, res) => {
  const { availableBotId } = req.params;

  const existing = await adminBotService.getAvailableBotById(availableBotId as string);
  if (!existing) throw new ApiError(404, 'Available bot not found');

  const bot = await adminBotService.toggleAvailableBot(availableBotId as string, !existing.isActive);
  return res.status(200).json(new ApiResponse(200, `Bot ${bot.isActive ? 'activated' : 'deactivated'} successfully`, bot, {}));
});

// DELETE /api/v1/admin/available-bots/:availableBotId
export const deleteAvailableBot = asyncHandler(async (req, res) => {
  const { availableBotId } = req.params;

  const existing = await adminBotService.getAvailableBotById(availableBotId as string);
  if (!existing) throw new ApiError(404, 'Available bot not found');

  const botCount = await adminBotService.getBotCountByAvailableBot(availableBotId as string);
  if (botCount > 0) throw new ApiError(409, `Cannot delete: ${botCount} bot(s) are using this template`);

  await adminBotService.deleteAvailableBot(availableBotId as string);
  return res.status(200).json(new ApiResponse(200, 'Available bot deleted successfully', {}, {}));
});
