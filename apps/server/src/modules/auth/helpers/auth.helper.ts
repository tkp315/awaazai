import bcrypt from 'bcryptjs';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import { UAParser } from 'ua-parser-js';
import AA from 'globals/index.js';
import { OAuth2Client } from 'google-auth-library';

export const authHelpers = {
  passwordEncryption: async (password: string) => {
    if (!password) return null;
    const encryptedPassword = await bcrypt.hash(password, 10);

    return encryptedPassword;
  },

  isCorrectPassword: async (hash: string, password: string) => {
    if (!hash || !password) {
      return null;
    }
    const isCorrectPassword = await bcrypt.compare(password, hash);

    return isCorrectPassword;
  },

  generateOtp: () => {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    return otp;
  },
  generateToken: async (isRefresh: boolean, payload: object) => {
    const tokenExpiry = isRefresh
      ? process.env.JWT_REFRESH_EXPIRES
      : process.env.JWT_ACCESS_EXPIRES;

    const tokenSecret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_ACCESS_SECRET;

    if (!tokenSecret || !tokenExpiry) {
      throw new Error('JWT configuration missing in environment variables');
    }

    return jwt.sign(payload, tokenSecret, {
      expiresIn: tokenExpiry as string,
    });
  },
  getDeviceInfo: (userAgent: any) => {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return result;
  },

  refreshToken: {
    add: async (userId: string, token: string, ttl: number = 7 * 24 * 60 * 60) => {
      const key = `refresh:${userId}`;
      await AA.libs.services.redis.set(key, token, ttl);
    },
    get: async (userId: string) => {
      const key = `refresh:${userId}`;
      return AA.libs.services.redis.get(key);
    },
    delete: async (userId: string) => {
      const key = `refresh:${userId}`;
      await AA.libs.services.redis.del(key);
    },
  },

  otp: {
    setOtpInRedis: async (otp: string, email: string) => {
      const redis = AA.libs.services.redis;
      await redis.set(`otp:${email}`, otp, 600);
    },
    getOtpFromRedis: async (email: string) => {
      const redis = AA.libs.services.redis;
      return redis.get(`otp:${email}`);
    },
    deleteOtpFromRedis: async (email: string) => {
      const redis = AA.libs.services.redis;
      await redis.del(`otp:${email}`);
    },
    sendOtpMail: async (
      to: string,
      otp: string,
      type: 'SIGNUP' | 'PASSWORD_RESET',
      expiryMinutes: number = 10
    ) => {
      const mailer = AA.libs.services.mail;
      return mailer.sendOTPMail({
        to,
        otp,
        type,
        expiryMinutes,
      });
    },
  },
  verifyToken: (isRefresh: boolean, token: string) => {
    const tokenSecret = isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_ACCESS_SECRET;

    if (!tokenSecret) {
      throw new Error('JWT configuration missing in environment variables');
    }

    try {
      const payload = jwt.verify(token, tokenSecret);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, payload: null };
    }
  },
  verifyGoogleToken: async (idToken: string) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return null;
    }
    return {
      googleId: payload?.sub,
      email: payload?.email,
      name: payload?.name,
      picture: payload?.picture,
    };
  },
};
