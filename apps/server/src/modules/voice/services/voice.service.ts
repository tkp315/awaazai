import { getPrisma } from '@lib/services/database/prisma/index.js';
import { getQueue } from '@lib/services/queue/client.js';
import type { CreateVoiceInput } from '../validators/voice.validation.js';
import type { VoiceStatus, SampleStatus } from 'generated/prisma/client.js';
import { AWAAZBOT_AVAILABLE_BOT_ID } from 'globals/constants.js';
// import { AWAAZBOT_AVAILABLE_BOT_ID } from '@globals/constants.js';

interface UploadedSample {
  url: string;
  duration: number;
  publicId: string;
}

export const voiceService = {
  // ─── Sample Voice ────────────────────────────────────────────────────────

  saveSamples: async (sessionId: string, samples: UploadedSample[]) => {
    const prisma = getPrisma();
    await prisma.sampleVoice.createMany({
      data: samples.map(s => ({
        sessionId,
        url: s.url,
        duration: s.duration,
        status: 'UPLOADED' as SampleStatus,
      })),
    });
    return prisma.sampleVoice.findMany({ where: { sessionId } });
  },

  getSamplesBySession: async (sessionId: string) => {
    const prisma = getPrisma();
    return prisma.sampleVoice.findMany({ where: { sessionId } });
  },

  deleteSample: async (sampleId: string) => {
    const prisma = getPrisma();
    return prisma.sampleVoice.delete({ where: { id: sampleId } });
  },

  // ─── Bot Voice ────────────────────────────────────────────────────────────

  createBotVoice: async (
    botId: string,
    userId: string,
    input: CreateVoiceInput,
    sessionId: string
  ) => {
    const prisma = getPrisma();

    // Agar is sessionId se BotVoice pehle se bana hai to wahi return karo
    const existing = await prisma.botVoice.findUnique({ where: { sessionId } });
    if (existing) {
      return prisma.botVoice.findUnique({
        where: { id: existing.id },
        include: { sampleVoices: true },
      });
    }

    const botVoice = await prisma.botVoice.create({
      data: {
        botId,
        sessionId,
        voiceName: input.voiceName,
        relation: input.relation,
        language: input.language,
        slangs: input.slangs ?? [],
        aiCallUserAs: input.aiCallUserAs,
        status: 'PENDING',
      },
    });

    // sessionId se sab samples link karo
    await prisma.sampleVoice.updateMany({
      where: { sessionId },
      data: { botVoiceId: botVoice.id },
    });

    // Cloning job enqueue karo
    const queue = getQueue('voiceClone');
    await queue.add('clone-voice', { botVoiceId: botVoice.id, botId, userId });

    return prisma.botVoice.findUnique({
      where: { id: botVoice.id },
      include: { sampleVoices: true },
    });
  },

  getAllReadyVoicesByUser: async (userId: string) => {
    const prisma = getPrisma();
    return prisma.botVoice.findMany({
      where: {
        status: 'READY',
        bot: { userId, availableBotId: AWAAZBOT_AVAILABLE_BOT_ID },
      },
      include: {
        bot: { select: { id: true, name: true, avatar: true } },
        sampleVoices: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  getVoicesByBot: async (botId: string) => {
    const prisma = getPrisma();
    return prisma.botVoice.findMany({
      where: { botId },
      include: { sampleVoices: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  getVoiceById: async (voiceId: string) => {
    const prisma = getPrisma();
    return prisma.botVoice.findUnique({
      where: { id: voiceId },
      include: { sampleVoices: true },
    });
  },

  deleteVoice: async (voiceId: string) => {
    const prisma = getPrisma();
    return prisma.botVoice.delete({ where: { id: voiceId } });
  },

  updateVoiceStatus: async (
    voiceId: string,
    status: VoiceStatus,
    data?: {
      elvenlabsVoiceId?: string;
      aiObservations?: object;
      generatedVoiceSample?: string;
    }
  ) => {
    const prisma = getPrisma();
    return prisma.botVoice.update({
      where: { id: voiceId },
      data: { status, ...data },
    });
  },

  updateSampleStatus: async (sampleId: string, status: SampleStatus, transcription?: string) => {
    const prisma = getPrisma();
    return prisma.sampleVoice.update({
      where: { id: sampleId },
      data: { status, ...(transcription ? { transcription } : {}) },
    });
  },

  retriggerCloning: async (voiceId: string, botId: string, userId: string) => {
    const prisma = getPrisma();
    await prisma.botVoice.update({ where: { id: voiceId }, data: { status: 'PENDING' } });
    const queue = getQueue('voiceClone');
    await queue.add('clone-voice', { botVoiceId: voiceId, botId, userId });
  },
};
