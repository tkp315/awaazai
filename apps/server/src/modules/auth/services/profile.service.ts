import { getPrisma } from '@lib/services/database/prisma/index.js';

interface UpdateProfilePayload {
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  age?: number;
}

interface UpsertPreferencesPayload {
  talkType?: 'CASUAL' | 'FORMAL' | 'FRIENDLY' | 'MOTIVATIONAL' | 'STORYTELLING';
  talkingTone?: 'CALM' | 'WARM' | 'ENERGETIC' | 'SERIOUS' | 'HUMOROUS';
  emotion?: 'HAPPY' | 'NEUTRAL' | 'EMPATHETIC' | 'ENCOURAGING' | 'RELAXED';
  responseLength?: 'SHORT' | 'MEDIUM' | 'DETAILED';
  preferredLanguage?: string;
  voiceSpeed?: 'SLOW' | 'NORMAL' | 'FAST';
  topicsOfInterest?: string[];
  avoidTopics?: string[];
  reminderEnabled?: boolean;
  reminderTime?: string;
  dailyGoalMinutes?: number;
}

export const profileService = {
  // Called internally during signup — all fields null/default
  createProfile: async (userId: string) => {
    const prisma = getPrisma();
    return prisma.profile.create({
      data: {
        userId,
        gender: 'OTHER',
        totalPlansPurchased: 0,
      },
    });
  },

  getProfile: async (userId: string) => {
    const prisma = getPrisma();
    return prisma.profile.findUnique({ where: { userId } });
  },

  // Update age, gender etc.
  updateProfile: async (userId: string, payload: UpdateProfilePayload) => {
    const prisma = getPrisma();
    return prisma.profile.update({
      where: { userId },
      data: payload,
    });
  },

  // Update avatar URL after cloudinary upload
  updateAvatar: async (userId: string, avatarUrl: string) => {
    const prisma = getPrisma();
    return prisma.profile.update({
      where: { userId },
      data: { avatar: avatarUrl },
    });
  },

  getMe: async (userId: string) => {
    const prisma = getPrisma();
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        isVerified: true,
        userStatus: true,
        accountType: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            age: true,
            gender: true,
            avatar: true,
            totalPlansPurchased: true,
          },
        },
      },
    });
  },

  getPreferences: async (userId: string) => {
    const prisma = getPrisma();
    return prisma.preferences.findFirst({
      where: { profile: { userId } },
    });
  },

  upsertPreferences: async (userId: string, payload: UpsertPreferencesPayload) => {
    const prisma = getPrisma();

    const profile = await prisma.profile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) throw new Error('Profile not found');

    return prisma.preferences.upsert({
      where: { profileId: profile.id },
      update: payload,
      create: {
        profileId: profile.id,
        talkType: payload.talkType ?? 'FRIENDLY',
        talkingTone: payload.talkingTone ?? 'WARM',
        emotion: payload.emotion ?? 'NEUTRAL',
        responseLength: payload.responseLength ?? 'MEDIUM',
        preferredLanguage: payload.preferredLanguage ?? 'en',
        voiceSpeed: payload.voiceSpeed ?? 'NORMAL',
        topicsOfInterest: payload.topicsOfInterest ?? [],
        avoidTopics: payload.avoidTopics ?? [],
        reminderEnabled: payload.reminderEnabled ?? false,
        reminderTime: payload.reminderTime,
        dailyGoalMinutes: payload.dailyGoalMinutes,
      },
    });
  },
};
