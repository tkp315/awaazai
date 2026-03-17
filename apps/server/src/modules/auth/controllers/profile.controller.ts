import ApiError from '@utils/apiError.js';
import ApiResponse from '@utils/apiResponse.js';
import asyncHandler from '@utils/asyncHandler.js';
import { updateProfileSchema, upsertPreferencesSchema } from '../validators/profile.validation.js';
import { profileService } from '../services/profile.service.js';
import { uploadFile } from '@lib/services/cloudinary/index.js';

// GET /api/v1/profile/me
export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const user = await profileService.getMe(userId);
  if (!user) throw new ApiError(404, 'User not found');

  return res.status(200).json(new ApiResponse(200, 'User fetched successfully', user, {}));
});

// PATCH /api/v1/profile  — update age, gender
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { success, data, error } = updateProfileSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const profile = await profileService.updateProfile(userId, data);

  return res.status(200).json(new ApiResponse(200, 'Profile updated successfully', profile, {}));
});

// PATCH /api/v1/profile/avatar  — upload profile picture via cloudinary
export const updateAvatar = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  if (!req.file) throw new ApiError(400, 'Image file is required');

  const result = await uploadFile(req.file.buffer, 'avatars', 'image', { publicId: userId });

  const profile = await profileService.updateAvatar(userId, result.secure_url);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Avatar updated successfully', { avatarUrl: profile.avatar }, {}));
});

// GET /api/v1/profile/preferences
export const getPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const preferences = await profileService.getPreferences(userId);

  return res.status(200).json(new ApiResponse(200, 'Preferences fetched successfully', preferences ?? {}, {}));
});

// PATCH /api/v1/profile/preferences  — upsert
export const upsertPreferences = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, 'Unauthorized');

  const { success, data, error } = upsertPreferencesSchema.safeParse(req.body);
  if (!success) throw new ApiError(400, `Validation Error: ${error}`);

  const preferences = await profileService.upsertPreferences(userId, data);

  return res.status(200).json(new ApiResponse(200, 'Preferences saved successfully', preferences, {}));
});
