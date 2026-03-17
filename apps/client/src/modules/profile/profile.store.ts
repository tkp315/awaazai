import { create } from 'zustand';
import { getMe, getPreferences } from './profile.service';
import type { IMe, IPreferences } from './profile.types';

interface ProfileState {
  user: IMe | null;
  preferences: IPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchMe: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  setUser: (user: IMe) => void;
  setPreferences: (preferences: IPreferences) => void;
  clearUser: () => void;
}

export const useProfileStore = create<ProfileState>(set => ({
  user: null,
  preferences: null,
  isLoading: false,
  error: null,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    const result = await getMe();
    if (result.success && 'data' in result) {
      set({ user: result.data as IMe, isLoading: false });
    } else {
      set({ error: result.message, isLoading: false });
    }
  },

  fetchPreferences: async () => {
    const result = await getPreferences();
    if (result.success && 'data' in result) {
      set({ preferences: result.data as IPreferences });
    }
  },

  setUser: (user: IMe) => set({ user }),

  setPreferences: (preferences: IPreferences) => set({ preferences }),

  clearUser: () => set({ user: null, preferences: null, error: null }),
}));
