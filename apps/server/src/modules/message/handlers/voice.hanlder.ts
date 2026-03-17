import type { Socket } from 'socket.io';
import { getPrisma } from '@lib/services/database/prisma/index.js';
import { buildSystemPrompt } from '../services/prompt.service.js';
import { runPipeline } from '../services/pipeline.service.js';
import { messageService } from '../services/messages.service.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { socketEvents as getSocketEvent } from '@lib/services/socket/index.js';

const activePipelines = new Map<string, AbortController>();
interface SendVoicePayload {
  chatId: string;
  sessionId: string;
  audioBase64: string;
  fileName?: string;
}

export const registerVoiceHandler = (socket: Socket) => {
  const logger = getLogger();
  const socketEvents = getSocketEvent();
  socket.on(socketEvents.sendVoice, async (payload: SendVoicePayload) => {
    const { chatId, sessionId, audioBase64, fileName } = payload;
    const userId = socket.data.userId;
    logger.info(
      `[VOICE_HANDLER] send_voice received | socketId: ${socket.id} | chatId: ${chatId} | sessionId: ${sessionId} | userId: ${userId}`
    );
    try {
      if (activePipelines.has(socket.id)) {
        logger.info(`[VOICE_HANDLER] Aborting existing pipeline for socketId: ${socket.id}`);
        activePipelines.get(socket.id)!.abort();
        activePipelines.delete(socket.id);
      }
      const prisma = getPrisma();
      logger.info(`[VOICE_HANDLER] Fetching chat: ${chatId}`);
      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          botVoice: {
            select: {
              id: true,
              language: true,
              elvenlabsVoiceId: true,
              bot: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });
      if (!chat) {
        logger.warn(`[VOICE_HANDLER] Chat not found: ${chatId}`);
        return socket.emit('error', { message: 'Chat not found' });
      }
      if (chat.botVoice.bot.userId !== userId) {
        logger.warn(
          `[VOICE_HANDLER] Unauthorized access | userId: ${userId} | ownerId: ${chat.botVoice.bot.userId}`
        );
        return socket.emit('error', { message: 'Unauthorized' });
      }
      if (!chat.botVoice.elvenlabsVoiceId) {
        logger.warn(`[VOICE_HANDLER] Voice not ready for botVoiceId: ${chat.botVoice.id}`);
        return socket.emit('error', { message: 'Voice not ready yet' });
      }
      logger.info(
        `[VOICE_HANDLER] Audio buffer size: ${audioBase64.length} chars | elvenlabsVoiceId: ${chat.botVoice.elvenlabsVoiceId}`
      );
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      logger.info(`[VOICE_HANDLER] Building system prompt`);
      const { systemPrompt, history } = await buildSystemPrompt(
        chatId,
        sessionId,
        chat.botVoice.id
      );
      logger.info(`[VOICE_HANDLER] System prompt built | history length: ${history.length}`);

      const abortController = new AbortController();
      activePipelines.set(socket.id, abortController);

      socket.emit(socketEvents.pipelineStart);
      logger.info(`[VOICE_HANDLER] Pipeline started`);

      const result = await runPipeline({
        audioBuffer,
        fileName: fileName ?? `voice-${Date.now()}.mp3`,
        language: chat.botVoice.language,
        elvenlabsVoiceId: chat.botVoice.elvenlabsVoiceId,
        systemPrompt,
        history,
        socket,
        abortSignal: abortController.signal,
      });
      activePipelines.delete(socket.id);
      logger.info(
        `[VOICE_HANDLER] Pipeline complete | emitting ai_stopped | audioUrl: ${result.aiAudioUrl}`
      );
      socket.emit('ai_stopped', { audioUrl: result.aiAudioUrl, aiText: result.aiText });
      logger.info(`[VOICE_HANDLER] Saving user message`);
      await messageService.saveMessage({
        chatId,
        sessionId,
        sentBy: 'user',
        messageContent: result.userTranscription,
        messageVoiceUrl: result.userAudioUrl,
      });
      logger.info(`[VOICE_HANDLER] Saving AI message`);
      await messageService.saveMessage({
        chatId,
        sessionId,
        sentBy: 'ai',
        messageContent: result.aiText,
        messageVoiceUrl: result.aiAudioUrl,
      });
      logger.info(`[VOICE_HANDLER] ✅ Messages saved | emitting message_saved`);
      socket.emit('message_saved', {
        userMessage: {
          sentBy: 'user',
          messageContent: result.userTranscription,
          messageVoiceUrl: result.userAudioUrl,
        },
        aiMessage: {
          sentBy: 'ai',
          messageContent: result.aiText,
          messageVoiceUrl: result.aiAudioUrl,
        },
      });
    } catch (err) {
      activePipelines.delete(socket.id);

      if (err instanceof Error && err.message === 'INTERRUPTED') {
        logger.info(`[VOICE_HANDLER] Pipeline interrupted: ${socket.id}`);
        return;
      }

      logger.error('[VOICE_HANDLER] ❌ Pipeline error', { error: (err as Error).message });
      socket.emit('error', { message: 'Something went wrong.Please try again.' });
    }
  });

  socket.on('user_interrupt', () => {
    if (activePipelines.has(socket.id)) {
      activePipelines.get(socket.id)!.abort();
      activePipelines.delete(socket.id);
      socket.emit('ai_stopped');
      logger.info(`[VOICE_HANDLER] Barge-in: pipeline aborted for ${socket.id}`);
    }
  });
};
