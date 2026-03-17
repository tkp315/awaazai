import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { getToken } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/shared/utils/constants';

let socket: Socket | null = null;

const getSocketUrl = (): string => {
  const debuggerHost =
    Constants?.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const backendPort = Constants?.expoConfig?.extra?.BACKEND_PORT;

  if (__DEV__ && debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:${backendPort}`;
  }
  return 'https://api.awaazai.com';
};

export const connectSocket = async (): Promise<Socket> => {
  if (socket?.connected) return socket;

  const token = await getToken(STORAGE_KEYS.AUTH_TOKEN);

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  });

  // Wait for connection before returning
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Socket connection timeout')), 10000);
    socket!.once('connect', () => {
      clearTimeout(timeout);
      resolve();
    });
    socket!.once('connect_error', err => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
