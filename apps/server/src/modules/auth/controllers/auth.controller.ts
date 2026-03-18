import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import asyncHandler from '@utils/asyncHandler.js';
import {
  loginSchema,
  resetPasswordSchema,
  sendOtpSchema,
  signupSchema,
  verifyOtpSchema,
} from '../validators/auth.validation.js';
import { authServices } from '../services/auth.service.js';
import { authHelpers } from '../helpers/auth.helper.js';
import { CookieOptions } from 'express';
import { profileService } from '../services/profile.service.js';


// signup *
// send otp *
// verify otp *
// login *
// logout *
// refresh token*
// reset-password*
// google login
// guest user
// get user information->profile
// profile ->crud

export const signup = asyncHandler(async (req, res) => {
  const payload = req.body;
  const validatedData = signupSchema.safeParse(payload);
  const { data, success, error } = validatedData;

  console.log('Error at auth', error);
  if (!success) {
    throw new ApiError(400, `Validation failed:${error}`);
  }

  const isAlreadyUser = await authServices.findUserByEmail(data.email);

  if (isAlreadyUser) {
    throw new ApiError(409, 'User is already registered');
  }
  const encryptedPassword = await authHelpers.passwordEncryption(data.password);
  const createUserPayload = {
    fullName: data?.fullName,
    email: data?.email!,
    password: encryptedPassword!,
    isVerified: false,
    userStatus: 'ACTIVE' as const,
    accountType: 'INDIVIDUAL' as const,
  };
  const user = await authServices.createUser(createUserPayload);
  await profileService.createProfile(user.id);

  return res.status(201).json(new ApiResponse(201, 'User registered successfully', {}, {}));
});

export const sendOtp = asyncHandler(async (req, res) => {
  const payload = req.body;

  const validatedData = sendOtpSchema.safeParse(payload);

  const { success, data, error } = validatedData;

  if (!success) {
    throw new ApiError(400, `Validation Error: ${JSON.stringify(error, null, 2)}`);
  }

  const otp = authHelpers.generateOtp();
  // const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await authHelpers.otp.setOtpInRedis(otp, data.email);

  await authHelpers.otp.sendOtpMail(data.email, otp, 'SIGNUP', 10).catch(err => {
    throw new ApiError(401, 'Unable to send email');
  });

  return res.status(200).json(new ApiResponse(200, 'Otp sent successfully', {}, {}));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const payload = req.body;

  const validatedData = verifyOtpSchema.safeParse(payload);

  const { success, data, error } = validatedData;

  if (!success) {
    throw new ApiError(400, `Validation Error: ${error}`);
  }

  const storedOtp = await authHelpers.otp.getOtpFromRedis(data.email);

  if (!storedOtp) {
    throw new ApiError(400, 'OTP not found or expired');
  }

  if (storedOtp !== data.code) {
    throw new ApiError(400, 'Incorrect OTP');
  }

  await authHelpers.otp.deleteOtpFromRedis(data.email);

  const user = await authServices.findUserByEmail(data.email);

  if (!user) {
    throw new ApiError(400, 'User not found');
  }
  await authServices.confirmUser(data.email);

  return res.status(200).json(new ApiResponse(200, 'User verified successfully', {}, {}));
});

export const login = asyncHandler(async (req, res) => {
  const payload = req.body;

  const validatedData = loginSchema.safeParse(payload);

  const { success, data, error } = validatedData;

  if (!success) {
    throw new ApiError(400, `Validation Error: ${JSON.stringify(error, null, 2)}`);
  }
  const { email, password } = data;
  const user = await authServices.findVerifiedUserByEmail(email);

  if (!user) {
    throw new ApiError(401, 'User is not registered');
  }

  const isPasswordCorrect = await authHelpers.isCorrectPassword(user.password, password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Incorrect password');
  }

  // generate tokens
  const tokenPayload = {
    id: user.id,
  };
  const accessToken = await authHelpers.generateToken(false, tokenPayload);

  const refreshToken = await authHelpers.generateToken(true, tokenPayload);

  // const refreshTokenPayload = {
  //   token: refreshToken,
  //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //   deviceId: data.deviceId || '',
  //   deviceInfo: data.deviceInfo || '',
  //   isRevoked: false,
  // };

  // await authServices.addRefreshToken(user.id, refreshTokenPayload);
  await authHelpers.refreshToken.add(user.id, refreshToken);
  // add token in cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict',
  };
  // login history
  const deviceInfo = authHelpers.getDeviceInfo(req.headers['user-agent']);

  const loginHistoryPayload = {
    userId: user.id,
    deviceId: data.deviceId ?? 'unknown',
    deviceType: 'mobile',
    ipAddress: JSON.stringify(req.ip),
    location: {},
    loginAt: new Date(),
    userAgent: JSON.stringify(deviceInfo) ?? null,
    sessionId: refreshToken,
  };
  await authServices.createLoginHistory(loginHistoryPayload);
  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      'Login Successful',
      {
        accessToken,
        refreshToken,
      },
      {}
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  // revoke refreshtoken from db and redis and cookie
  const userId = req.user?.id;
  const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
  if (!userId) {
    throw new ApiError(401, 'User not found');
  }
  if (!refreshToken) {
    throw new ApiError(401, 'RefreshToken required');
  }
  await authHelpers.refreshToken.delete(userId);
  // await authServices.revokeRefreshToken(userId);

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV == 'prod',
  };
  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, 'Logout successfuly'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const payload = req.body;
  const validatedData = resetPasswordSchema.safeParse(payload);
  const { success, data, error } = validatedData;

  if (!success) {
    throw new ApiError(400, `Validation Error: ${error.message}`);
  }
  const user = await authServices.findUserByEmail(data.email);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const encryptedPassword = await authHelpers.passwordEncryption(data.newPassword);

  await authServices.updatePassword(data.email, encryptedPassword!);

  return res.status(200).json(new ApiResponse(200, 'Password updated successfully'));
});

export const refreshToken = asyncHandler(async (req, res) => {
  let refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const userId = req.user?.id;

  if (!refreshToken) {
    refreshToken = await authHelpers.refreshToken.get(userId!);
  }
  const isTokenVerified = authHelpers.verifyToken(true, refreshToken);

  if (!isTokenVerified.valid) {
    throw new ApiError(401, 'Invalid token');
  }

  await authServices.revokeRefreshToken(refreshToken);
  await authHelpers.refreshToken.delete(userId!);

  const tokenPayload = {
    id: userId,
  };
  const newAccessToken = await authHelpers.generateToken(false, tokenPayload);
  const newRefreshToken = await authHelpers.generateToken(true, tokenPayload);

  await authHelpers.refreshToken.add(userId!, newRefreshToken);
  // add token in cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict',
  };

  res.cookie('accessToken', newAccessToken, cookieOptions);
  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      'Token refreshed successfuly',
      {
        newAccessToken,
        newRefreshToken,
      },
      {}
    )
  );
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken, deviceId } = req.body;

  const payload = await authHelpers.verifyGoogleToken(idToken);

  if (!payload) {
    throw new ApiError(401, 'Invalid token');
  }

  let user = await authServices.findUserByEmail(payload.email!);

  if (!user) {
    const createUserPayload = {
      fullName: payload.name || '',
      email: payload.email!,
      password: null,
      isVerified: true,
      userStatus: 'ACTIVE' as const,
      accountType: 'INDIVIDUAL' as const,
    };
    user = await authServices.createUser(createUserPayload);
    await profileService.createProfile(user.id);
  }
  const tokenPayload = {
    id: user.id,
  };
  const accessToken = await authHelpers.generateToken(false, tokenPayload);

  const refreshToken = await authHelpers.generateToken(true, tokenPayload);
  await authHelpers.refreshToken.add(user.id, refreshToken);
  // add token in cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict',
  };
  // login history
  const deviceInfo = authHelpers.getDeviceInfo(req.headers['user-agent']);

  const loginHistoryPayload = {
    userId: user.id,
    deviceId: deviceId ?? 'unknown',
    deviceType: 'mobile',
    ipAddress: JSON.stringify(req.ip),
    location: {},
    loginAt: new Date(),
    userAgent: JSON.stringify(deviceInfo) ?? null,
    sessionId: refreshToken,
  };
  await authServices.createLoginHistory(loginHistoryPayload);
  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      'Login Successful',
      {
        accessToken,
        refreshToken,
      },
      {}
    )
  );
});

export const guestLogin = asyncHandler(async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    throw new ApiError(400, 'Device ID is required');
  }

  // Check if guest already exists
  let guest = await authServices.findGuestByDeviceId(deviceId);

  if (!guest) {
    guest = await authServices.createGuestUser({ deviceId });
  }

  // Generate tokens for guest
  const tokenPayload = {
    id: guest.id,
    isGuest: true,
  };

  const accessToken = await authHelpers.generateToken(false, tokenPayload);
  const refreshToken = await authHelpers.generateToken(true, tokenPayload);

  await authHelpers.refreshToken.add(guest.id, refreshToken);

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: 'strict',
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      'Guest login successful',
      {
        guestId: guest.id,
        trialUsed: guest.trialUsed,
        accessToken,
        refreshToken,
      },
      {}
    )
  );
});
