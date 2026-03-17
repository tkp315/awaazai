import asyncHandler from '@utils/asyncHandler.js';
import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import { voiceHelper } from '../helpers/voice.helper.js';
import { voiceService } from '../services/voice.service.js';
import { createVoiceSchema } from '../validators/voice.validation.js';

// ─── Sample Voice ─────────────────────────────────────────────────────────

// POST /api/voices/samples
// Body: { sessionId }  Files: samples[]
export const uploadSampleVoice = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { sessionId } = req.body;
  if (!sessionId) throw new ApiError(400, 'sessionId is required');

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    throw new ApiError(400, 'At least one audio sample is required');

  const uploaded = await voiceHelper.processFiles(files, sessionId);

  const samples = await voiceService.saveSamples(sessionId, uploaded);

  return res.status(201).json(new ApiResponse(201, 'Samples uploaded successfully', samples, {}));
});

// DELETE /api/voices/samples/:sampleId
export const deleteSampleVoice = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { sampleId } = req.params;
  await voiceService.deleteSample(sampleId as string);

  return res.status(200).json(new ApiResponse(200, 'Sample deleted', {}, {}));
});

// GET /api/voices/samples/:sessionId
export const getSamplesBySession = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { sessionId } = req.params;
  const samples = await voiceService.getSamplesBySession(sessionId as string);

  return res.status(200).json(new ApiResponse(200, 'Samples fetched', samples, {}));
});

// ─── Bot Voice ────────────────────────────────────────────────────────────

// POST /api/voices/bots/:botId
// Body: { voiceName, relation, language, slangs, aiCallUserAs, sessionId }
export const createBotVoice = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;

  const { success, data, error } = createVoiceSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const { sessionId } = req.body;
  if (!sessionId) throw new ApiError(400, 'sessionId is required');

  const voice = await voiceService.createBotVoice(botId as string, userId, data, sessionId);

  return res
    .status(201)
    .json(new ApiResponse(201, 'Voice profile created and queued for cloning', voice, {}));
});

// GET /api/voices/ready  — all READY voices for logged-in user
export const getAllReadyVoices = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const voices = await voiceService.getAllReadyVoicesByUser(userId);
  return res.status(200).json(new ApiResponse(200, 'Ready voices fetched', voices, {}));
});

// GET /api/voices/bots/:botId
export const getVoicesByBot = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { botId } = req.params;
  const voices = await voiceService.getVoicesByBot(botId as string);

  return res.status(200).json(new ApiResponse(200, 'Voices fetched', voices, {}));
});

// GET /api/voices/:voiceId
export const getVoiceById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { voiceId } = req.params;
  const voice = await voiceService.getVoiceById(voiceId as string);
  if (!voice) throw new ApiError(404, 'Voice not found');

  return res.status(200).json(new ApiResponse(200, 'Voice fetched', voice, {}));
});

// DELETE /api/voices/:voiceId
export const deleteVoice = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { voiceId } = req.params;
  const voice = await voiceService.getVoiceById(voiceId as string);
  if (!voice) throw new ApiError(404, 'Voice not found');

  // ElevenLabs se bhi delete karo (non-fatal)
  if (voice.elvenlabsVoiceId) {
    const { deleteVoice: elDelete } = await import('@lib/services/ai/elevenlabs/service.js');
    await elDelete(voice.elvenlabsVoiceId).catch(() => {});
  }

  await voiceService.deleteVoice(voiceId as string);

  return res.status(200).json(new ApiResponse(200, 'Voice deleted', {}, {}));
});

// POST /api/voices/:voiceId/clone  — retry cloning if FAILED
export const retriggerCloning = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { voiceId } = req.params;
  const voice = await voiceService.getVoiceById(voiceId as string);
  if (!voice) throw new ApiError(404, 'Voice not found');

  if (voice.status === 'PROCESSING') throw new ApiError(409, 'Cloning already in progress');

  await voiceService.retriggerCloning(voiceId as string, voice.botId, userId);

  return res.status(200).json(new ApiResponse(200, 'Cloning retriggered', {}, {}));
});
