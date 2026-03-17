import { getPrisma } from '@lib/services/database/prisma/index.js';
import { transcribeAudioBuffer, chat } from '@lib/services/ai/openai/service.js';
import { cloneVoice, textToSpeech } from '@lib/services/ai/elevenlabs/service.js';
import { uploadFile } from '@lib/services/cloudinary/index.js';
import { getLogger } from '@lib/helper/logger/index.js';
import axios from 'axios'

// ─── Helpers ────────────────────────────────────────────────────────────────

const downloadAsBuffer = async (url: string): Promise<Buffer> => {
  const res = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
};

const generateVoiceObservations = async (
  transcriptions: string[],
  meta: {
    voiceName: string | null;
    relation: string | null;
    language: string;
    slangs: string[];
    aiCallUserAs: string | null;
  }
): Promise<object> => {
  const combined = transcriptions.join('\n---\n');

  const prompt = `You are analyzing voice samples of a real person to build an authentic AI clone.

Person details:
- Name: ${meta.voiceName ?? 'Unknown'}
- Relation to user: ${meta.relation ?? 'Unknown'}
- Primary language: ${meta.language}
- Common slangs they use: ${meta.slangs.length ? meta.slangs.join(', ') : 'none provided'}

Transcriptions from their voice samples:
${combined}

Analyze and return a JSON object with exactly these fields:
{
  "speakingStyle": "short description of how they speak (pace, structure)",
  "tone": "emotional tone (e.g. warm, playful, authoritative, caring)",
  "commonPhrases": ["phrase1", "phrase2"],
  "personality": "2-3 sentence personality summary",
  "languageNotes": "notable language patterns, code-switching, slang usage",
  "suggestedSystemPrompt": "a system prompt for an AI to roleplay as this person authentically"
}

Return only valid JSON, no markdown.`;

  const response = await chat([{ role: 'user', content: prompt }], { temperature: 0.3 });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { raw: response };
  } catch {
    return { raw: response };
  }
};

// ─── Main Processor ─────────────────────────────────────────────────────────

export const processCloningJob = async (data: {
  botVoiceId: string;
  botId: string;
  userId: string;
}): Promise<void> => {
  const { botVoiceId } = data;
  const logger = getLogger();
  const prisma = getPrisma();

  logger.info(`[CLONING] Starting job for botVoiceId: ${botVoiceId}`);

  // 1. Fetch botVoice with samples
  const botVoice = await prisma.botVoice.findUnique({
    where: { id: botVoiceId },
    include: { sampleVoices: true },
  });

  if (!botVoice) throw new Error(`BotVoice not found: ${botVoiceId}`);
  if (!botVoice.sampleVoices.length) throw new Error('No samples found for cloning');

  logger.info(`[CLONING] Found ${botVoice.sampleVoices.length} samples for "${botVoice.voiceName}"`);

  try {
    // 2. Mark as PROCESSING
    await prisma.botVoice.update({ where: { id: botVoiceId }, data: { status: 'PROCESSING' } });
    await prisma.sampleVoice.updateMany({ where: { botVoiceId }, data: { status: 'PROCESSING' } });
    logger.info(`[CLONING] Status → PROCESSING`);

    // 3. Download + transcribe each sample
    const audioBuffers: Buffer[] = [];
    const transcriptions: string[] = [];

    for (const sample of botVoice.sampleVoices) {
      if (!sample.url) continue;
      logger.info(`[CLONING] Downloading sample: ${sample.id}`);
      const buffer = await downloadAsBuffer(sample.url);
      audioBuffers.push(buffer);

      logger.info(`[CLONING] Transcribing sample: ${sample.id}`);
      const transcription = await transcribeAudioBuffer(buffer, `sample_${sample.id}.mp3`, { language: botVoice.language });
      transcriptions.push(transcription);
      logger.info(`[CLONING] Transcription done: "${transcription.slice(0, 60)}..."`);

      await prisma.sampleVoice.update({ where: { id: sample.id }, data: { status: 'TRANSCRIBED', transcription } });
    }

    if (!audioBuffers.length) throw new Error('No downloadable samples found');

    // 4. GPT observations
    logger.info(`[CLONING] Generating AI observations via GPT`);
    const aiObservations = await generateVoiceObservations(transcriptions, {
      voiceName: botVoice.voiceName,
      relation: botVoice.relation,
      language: botVoice.language,
      slangs: botVoice.slangs as string[],
      aiCallUserAs: botVoice.aiCallUserAs,
    });
    logger.info(`[CLONING] AI observations generated`);

    // 5. ElevenLabs IVC
    logger.info(`[CLONING] Cloning voice on ElevenLabs (IVC)`);
    const elvenlabsVoiceId = await cloneVoice(audioBuffers, { name: botVoice.voiceName! });
    logger.info(`[CLONING] ElevenLabs voice created: ${elvenlabsVoiceId.voiceId}`);

    // 6. Generate preview
    const previewText = botVoice.language === 'hi'
      ? `नमस्ते! मैं ${botVoice.voiceName ?? 'यहाँ'} हूं। तुमसे बात करके बहुत अच्छा लगा।`
      : `Hey! It's ${botVoice.voiceName ?? 'me'}. So good to hear from you.`;

    logger.info(`[CLONING] Generating preview TTS`);
    const previewBuffer = await textToSpeech(elvenlabsVoiceId.voiceId, previewText);

    // 7. Upload preview to Cloudinary
    logger.info(`[CLONING] Uploading preview to Cloudinary`);
    const uploaded = await uploadFile(previewBuffer, 'voice-previews', 'audio', { publicId: `preview_${botVoiceId}` });
    logger.info(`[CLONING] Preview uploaded: ${uploaded.url}`);

    // 8. Mark READY
    await prisma.botVoice.update({
      where: { id: botVoiceId },
      data: { status: 'READY', elvenlabsVoiceId: elvenlabsVoiceId.voiceId, aiObservations, generatedVoiceSample: uploaded.url },
    });
    logger.info(`[CLONING] ✅ Job complete → READY | voiceId: ${botVoiceId}`);

  } catch (err) {
    logger.error(`[CLONING] ❌ Job failed for ${botVoiceId}`, { error: (err as Error).message });
    await prisma.botVoice.update({ where: { id: botVoiceId }, data: { status: 'FAILED' } });
    throw err;
  }
};
