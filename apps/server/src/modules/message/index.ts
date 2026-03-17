import type { Socket, Server } from 'socket.io';
import { registerVoiceHandler } from './handlers/voice.hanlder.js';
import { registerSessionHandler } from './handlers/session.handler.js';
import { getLogger } from '@lib/helper/logger/index.js';

export const registerMessageHandlers = (io: Server): void => {
  const logger = getLogger();

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`, { userId: socket.data.userId });

    registerSessionHandler(socket);
    registerVoiceHandler(socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};
