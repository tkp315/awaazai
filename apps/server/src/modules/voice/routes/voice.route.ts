import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '@middlewares/auth.middleware.js';
import { checkLimit } from '@middlewares/subscription.middleware.js';
import {
  uploadSampleVoice,
  deleteSampleVoice,
  getSamplesBySession,
  createBotVoice,
  getVoicesByBot,
  getAllReadyVoices,
  getVoiceById,
  deleteVoice,
  retriggerCloning,
} from '../controllers/voice.controller.js';

const router = Router();

const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10MB, max 5 files
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/webm',
      'audio/ogg',
      'audio/m4a',
      'audio/x-m4a',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (mp3, wav, webm, ogg, m4a)'));
    }
  },
});

// All voice routes require auth
router.use(authMiddleware);

// ==========================================
// SAMPLE VOICE
// ==========================================
router.post('/samples', audioUpload.array('samples', 5), uploadSampleVoice);
router.get('/samples/:sessionId', getSamplesBySession);
router.delete('/samples/:sampleId', deleteSampleVoice);

// ==========================================
// BOT VOICE
// ==========================================
router.get('/ready', getAllReadyVoices);
router.post('/bots/:botId', checkLimit('VOICE_CLONES'), createBotVoice);
router.get('/bots/:botId', getVoicesByBot);

// ==========================================
// VOICE BY ID
// ==========================================
router.get('/:voiceId', getVoiceById);
router.delete('/:voiceId', deleteVoice);
router.post('/:voiceId/clone', retriggerCloning);

export default router;
