import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { socketAuthMiddleware } from './middleware.js';
import { getLogger } from '@lib/helper/logger/index.js';
import { registerMessageHandlers } from '@modules/message/index.js';

let io: SocketServer | null = null;

export function initSocket(httpServer: HttpServer) {
  const logger = getLogger();

  io = new SocketServer(httpServer);

  io.use(socketAuthMiddleware);
  registerMessageHandlers(io);
  logger.info('✅ Socket.io initialized');
  return io;
}

export function getIO(): SocketServer {
  if (!io) {
    throw new Error('Socket is not initialised');
  }
  return io;
}

export const socketEvents = () => {
  const events = {
    transcribing: 'transcribing',
    textChunk: 'text_chunk',
    audioChunk: 'audio_chunk',
    sendVoice: 'send_voice',
    pipelineStart: 'pipeline_start',
  };
  return events;
};
