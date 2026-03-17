import type { Socket } from 'socket.io';
import { getLogger } from '@lib/helper/logger/index.js';

interface JoinSessionPayload {
  chatId: string;
  sessionId: string;
}

export const registerSessionHandler = (socket: Socket): void => {
  const logger = getLogger();

  socket.on('join_session', (payload: JoinSessionPayload) => {
    const { chatId, sessionId } = payload;

    const room = `${chatId}:${sessionId}`;
    socket.join(room);

    logger.info(`Socket ${socket.id} joined room: ${room}`);
    socket.emit('session_joined', { chatId, sessionId, room });
  });

  socket.on('leave_session', (payload: JoinSessionPayload) => {
    const { chatId, sessionId } = payload;

    const room = `${chatId}:${sessionId}`;
    socket.leave(room);

    logger.info(`Socket ${socket.id} left room: ${room}`);
    socket.emit('session_left', { chatId, sessionId });
  });
};
