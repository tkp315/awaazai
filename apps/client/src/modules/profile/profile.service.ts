import axiosInstance from '@/api/fetch/client';
import { ApiError, ApiResponse } from '@/shared';
import axios, { AxiosError } from 'axios';
import type {
  IMe,
  IPreferences,
  UpdateProfilePayload,
  UpsertPreferencesPayload,
} from './profile.types';

const PROFILE_ENDPOINTS = {
  ME: 'profile/me',
  UPDATE: 'profile',
  AVATAR: 'profile/avatar',
  PREFERENCES: 'profile/preferences',
};

function handleAxiosError(error: unknown, fallbackCode: string): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const serverMessage = axiosError.response?.data?.message;
    return {
      message: serverMessage || axiosError.message || 'Something went wrong',
      success: false,
      error: { code: fallbackCode, details: axiosError.response?.data || {} },
    };
  }
  return {
    message: error instanceof Error ? error.message : 'Something went wrong',
    success: false,
    error: { code: fallbackCode, details: {} },
  };
}

export const getMe = async (): Promise<ApiResponse<IMe> | ApiError> => {
  try {
    const res = await axiosInstance.get(PROFILE_ENDPOINTS.ME);
    return { data: res.data.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'GET_ME_ERROR');
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse | ApiError> => {
  try {
    const res = await axiosInstance.patch(PROFILE_ENDPOINTS.UPDATE, payload);
    return { data: res.data.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'UPDATE_PROFILE_ERROR');
  }
};

export const updateAvatar = async (imageUri: string): Promise<ApiResponse | ApiError> => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() ?? 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    formData.append('avatar', { uri: imageUri, name: filename, type } as unknown as Blob);

    const res = await axiosInstance.patch(PROFILE_ENDPOINTS.AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { data: res.data.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'UPDATE_AVATAR_ERROR');
  }
};

export const getPreferences = async (): Promise<ApiResponse<IPreferences> | ApiError> => {
  try {
    const res = await axiosInstance.get(PROFILE_ENDPOINTS.PREFERENCES);
    return { data: res.data.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'GET_PREFERENCES_ERROR');
  }
};

export const upsertPreferences = async (
  payload: UpsertPreferencesPayload
): Promise<ApiResponse<IPreferences> | ApiError> => {
  try {
    const res = await axiosInstance.patch(PROFILE_ENDPOINTS.PREFERENCES, payload);
    return { data: res.data.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'UPSERT_PREFERENCES_ERROR');
  }
};
