import { transcribeAudioBuffer, chatStream } from '@lib/services/ai/openai/service.js';
import { textToSpeech } from '@lib/services/ai/elevenlabs/service.js';
import { uploadFile } from '@lib/services/cloudinary/index.js';
import type { Socket } from 'socket.io';
import { getLogger } from '@lib/helper/logger/index.js';

interface PipelineInput {
  audioBuffer: Buffer;
  fileName: string;
  language: string;
  elvenlabsVoiceId: string;
  systemPrompt: string | string[];
  history: { role: 'user' | 'assistant'; content: string }[];
  socket: Socket;
  abortSignal: AbortSignal;
}

interface PipelineResult {
  userTranscription: string;
  userAudioUrl: string;
  aiText: string;
  aiAudioUrl: string;
}

// ─── Speech Friendly Text ────────────────────────────────────────────────────

const makeSpeechFriendly = (text: string): string => {
  return text
    // markdown hataao
    .replace(/\*\*?(.*?)\*\*?/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/`+/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^\s*[-*•]\s+/gm, '')
    // newlines → pauses
    .replace(/\n{2,}/g, '... ')
    .replace(/\n/g, ', ')
    // em dash → natural pause
    .replace(/—/g, '... ')
    // multiple spaces clean
    .replace(/\s{2,}/g, ' ')
    // sentence end ke baad thoda zyada pause
    .replace(/([।?!])\s+/g, '$1... ')
    // "hmm" ke baad pause
    .replace(/\b(hmm|hm|ummm?)\b/gi, '$1...')
    // trailing cleanup
    .trim();
};

// ─── Mood Detection ──────────────────────────────────────────────────────────

const HAPPY_WORDS = ['wah', 'kya baat', 'sach mein', 'amazing', 'zabardast', 'bahut accha', 'khushi', 'mast', 'dhamaal', 'woah', '!', 'haha', 'hehe', 'lol'];
const SAD_WORDS = ['koi baat nahi', 'arre yaar', 'dukh', 'bura laga', 'mushkil', 'takleef', 'pareshan', 'chinta', 'rona', 'sad', 'sorry', 'hmm...', 'hey sun'];

type MoodSettings = {
  mood: 'happy' | 'sad' | 'neutral';
  stability: number;
  similarityBoost: number;
  style: number;
};

const detectMoodSettings = (text: string): MoodSettings => {
  const lower = text.toLowerCase();
  const happyScore = HAPPY_WORDS.filter(w => lower.includes(w)).length;
  const sadScore = SAD_WORDS.filter(w => lower.includes(w)).length;

  if (happyScore > sadScore && happyScore >= 1) {
    // Excited/happy — low stability = zyada variation, high style = expressive
    return { mood: 'happy', stability: 0.2, similarityBoost: 0.85, style: 0.8 };
  }
  if (sadScore > happyScore && sadScore >= 1) {
    // Sad/caring — higher stability = smooth soft voice, low style = gentle
    return { mood: 'sad', stability: 0.5, similarityBoost: 0.9, style: 0.3 };
  }
  // Neutral — balanced
  return { mood: 'neutral', stability: 0.3, similarityBoost: 0.85, style: 0.6 };
};

export const runPipeline = async (input: PipelineInput): Promise<PipelineResult> => {
  const {
    audioBuffer, fileName, language,
    elvenlabsVoiceId, systemPrompt, history,
    socket, abortSignal,
  } = input;

  const logger = getLogger();
  logger.info(`[PIPELINE] Starting | socketId: ${socket.id} | file: ${fileName} | lang: ${language}`);

  // ── Step 1: User audio upload + Whisper STT (parallel) ──
  logger.info(`[PIPELINE] Step 1: Uploading user audio & transcribing in parallel`);
  const [userUpload, userTranscription] = await Promise.all([
    uploadFile(audioBuffer, 'message-audio', 'audio', {
      publicId: `user_${Date.now()}`,
      format: 'mp3',
    }),
    transcribeAudioBuffer(audioBuffer, fileName, { language }),
  ]);
  logger.info(`[PIPELINE] User audio uploaded: ${userUpload.url}`);
  logger.info(`[PIPELINE] Transcription: "${userTranscription.slice(0, 80)}"`);
  socket.emit('transcribing', { text: userTranscription });

  if (abortSignal.aborted) throw new Error('INTERRUPTED');

  // ── Step 2: GPT — poora response collect karo ──
  logger.info(`[PIPELINE] Step 2: GPT stream start`);
  const messages = [
    { role: 'system' as const, content: Array.isArray(systemPrompt) ? systemPrompt.join('\n\n') : systemPrompt },
    ...history,
    { role: 'user' as const, content: userTranscription },
  ];

  let fullAiText = '';
  for await (const word of chatStream(messages, { temperature: 0.95 })) {
    if (abortSignal.aborted) throw new Error('INTERRUPTED');
    fullAiText += word;
    socket.emit('text_chunk', { chunk: word, full: fullAiText });
  }
  logger.info(`[PIPELINE] GPT done | text: "${fullAiText.slice(0, 80)}"`);

  if (abortSignal.aborted) throw new Error('INTERRUPTED');

  // ── Step 3: Text ko speech-friendly banao, mood detect karo, phir TTS ──
  const spokenText = makeSpeechFriendly(fullAiText);

  // Mood detect karo text se → TTS settings adjust karo
  const moodSettings = detectMoodSettings(spokenText);
  logger.info(`[PIPELINE] Step 3: TTS | mood: ${moodSettings.mood} | stability: ${moodSettings.stability} | style: ${moodSettings.style} | text: "${spokenText.slice(0, 80)}"`);
  socket.emit('audio_chunk', {});
  const aiAudioBuffer = await textToSpeech(elvenlabsVoiceId, spokenText, {
    stability: moodSettings.stability,
    similarityBoost: moodSettings.similarityBoost,
    style: moodSettings.style,
  });
  logger.info(`[PIPELINE] TTS done | bytes: ${aiAudioBuffer.length}`);

  // ── Step 4: Cloudinary upload ──
  logger.info(`[PIPELINE] Step 4: Uploading AI audio to Cloudinary`);
  const aiUpload = await uploadFile(aiAudioBuffer, 'message-audio', 'audio', {
    publicId: `ai_${Date.now()}`,
  });
  logger.info(`[PIPELINE] AI audio uploaded: ${aiUpload.url}`);
  logger.info(`[PIPELINE] ✅ Pipeline complete`);

  return {
    userTranscription,
    userAudioUrl: userUpload.url,
    aiText: fullAiText,
    aiAudioUrl: aiUpload.url,
  };
};
