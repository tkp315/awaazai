import { create } from 'zustand';
import { saveToken, getToken, deleteToken } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/shared';

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
    await saveToken(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    await saveToken(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    set({ accessToken, refreshToken, isLoggedIn: true });
  },

  clearTokens: async () => {
    await deleteToken(STORAGE_KEYS.AUTH_TOKEN);
    await deleteToken(STORAGE_KEYS.REFRESH_TOKEN);
    set({ accessToken: null, refreshToken: null, isLoggedIn: false });
  },

  loadTokens: async () => {
    set({ isLoading: true });
    const accessToken = await getToken(STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = await getToken(STORAGE_KEYS.REFRESH_TOKEN);
    set({
      accessToken,
      refreshToken,
      isLoggedIn: !!accessToken,
      isLoading: false,
    });
  },
}));
