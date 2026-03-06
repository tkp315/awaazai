import { getPrisma } from '@lib/services/database/prisma/index.js';

interface CreateUserPayload {
  fullName: string;
  password: string | null;
  isVerified: boolean;
  email: string;
  userStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  accountType: 'INDIVIDUAL' | 'ORGANIZATION';
}

interface CreateGuestUserPayload {
  deviceId: string;
  trialUsed?: boolean;
}
interface OtpPayload {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  type: 'EMAIL_VERIFY' | 'PASSWORD_RESET';
}
interface RefreshTokenPayload {
  token: string;
  expiresAt: Date;
  deviceId?: string;
  deviceInfo?: string;
  isRevoked: boolean;
  revokedAt?: Date;
}
interface CreateLoginHistoryPayload {
  userId: string;
  deviceId?: string;
  deviceType: string;
  ipAddress: string;
  userAgent?: string | null;
  sessionId?: string | null;
  failReason?: string | null;
  location?: any;
}
export const authServices = {
  findUserByEmail: async (email: string) => {
    if (!email) {
      throw new Error('Email required');
    }
    return await getPrisma().user.findFirst({
      where: {
        email,
      },
    });
  },
  findVerifiedUserByEmail: async (email: string) => {
    if (!email) {
      throw new Error('Email required');
    }
    return await getPrisma().user.findFirst({
      where: {
        email,
        isVerified: true,
      },
    });
  },
  createUser: async (payload: CreateUserPayload) => {
    const user = await getPrisma().user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password!,
        isVerified: payload.isVerified ?? false,
        userStatus: payload.userStatus ?? 'ACTIVE',
        accountType: payload.accountType ?? 'INDIVIDUAL',
      },
    });

    return user;
  },
  createOtp: async (payload: OtpPayload) => {
    const otp = await getPrisma().oTP.create({
      data: {
        email: payload.email,
        otp: payload.otp,
        expiresAt: payload.expiresAt,
        attempts: payload.attempts,
        type: payload.type,
      },
    });
    return otp;
  },
  findLatestOtp: async (email: string) => {
    if (!email) {
      throw new Error('Email required');
    }
    return await getPrisma().oTP.findFirst({
      where: {
        email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
  confirmUser: async (email: string) => {
    if (!email) {
      throw new Error('Email required');
    }
    const user = await getPrisma().user.update({
      data: {
        isVerified: true,
      },
      where: {
        email,
      },
    });
    return user;
  },
  addRefreshToken: async (userId: string, payload: RefreshTokenPayload) => {
    const token = await getPrisma().refreshToken.create({
      data: {
        token: payload.token,
        expiresAt: payload.expiresAt,
        deviceId: payload.deviceId,
        deviceInfo: payload.deviceInfo,
        isRevoked: payload.isRevoked,
        revokedAt: undefined,
        userId,
      },
    });

    return token;
  },
  createLoginHistory: async (payload: CreateLoginHistoryPayload) => {
    return await getPrisma().loginHistory.create({
      data: {
        userId: payload.userId,
        deviceId: payload.deviceId!,
        deviceType: payload.deviceType,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent ?? null,
        sessionId: payload.sessionId ?? null,
        failReason: payload.failReason ?? null,
        location: payload.location ?? null,
        loginAt: new Date(),
      },
    });
  },

  revokeRefreshToken: async (id: string) => {
    await getPrisma().refreshToken.updateMany({
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
      where: {
        OR: [{ userId: id }, { token: id }],
      },
    });
  },
  updatePassword: async (email: string, newPassword: string) => {
    if (!email) {
      throw new Error('Email required');
    }
    const user = await getPrisma().user.update({
      data: {
        password: newPassword,
      },
      where: {
        email,
      },
    });
    return user;
  },

  // Guest User
  createGuestUser: async (payload: CreateGuestUserPayload) => {
    const guest = await getPrisma().guestUser.create({
      data: {
        deviceId: payload.deviceId,
        trialUsed: payload.trialUsed ?? false,
        enteredAt: new Date(),
      },
    });
    return guest;
  },

  findGuestByDeviceId: async (deviceId: string) => {
    return await getPrisma().guestUser.findFirst({
      where: { deviceId },
    });
  },

  updateGuestTrialUsed: async (guestId: string) => {
    return await getPrisma().guestUser.update({
      where: { id: guestId },
      data: { trialUsed: true, triedAt: new Date() },
    });
  },

  convertGuestToUser: async (guestId: string, userId: string) => {
    return await getPrisma().guestUser.update({
      where: { id: guestId },
      data: {
        convertedTo: userId,
        convertedAt: new Date(),
      },
    });
  },
};
