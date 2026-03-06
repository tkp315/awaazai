import { create } from 'zustand';
import { saveToken, getToken, deleteToken } from '@/shared/utils/storage';

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isLoading: false,

  setTokens: async (accessToken, refreshToken) => {
    await saveToken(KEYS.ACCESS_TOKEN, accessToken);
    await saveToken(KEYS.REFRESH_TOKEN, refreshToken);
    set({ accessToken, refreshToken, isLoggedIn: true });
  },

  clearTokens: async () => {
    await deleteToken(KEYS.ACCESS_TOKEN);
    await deleteToken(KEYS.REFRESH_TOKEN);
    set({ accessToken: null, refreshToken: null, isLoggedIn: false });
  },

  loadTokens: async () => {
    set({ isLoading: true });
    const accessToken = await getToken(KEYS.ACCESS_TOKEN);
    const refreshToken = await getToken(KEYS.REFRESH_TOKEN);
    set({
      accessToken,
      refreshToken,
      isLoggedIn: !!accessToken,
      isLoading: false,
    });
  },
}));
