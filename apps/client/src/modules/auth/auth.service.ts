import { BASE_URL } from '@/api/fetch/config';
import { ApiError, ApiResponse } from '@/shared';
import axios, { AxiosError } from 'axios';

const AUTH_ENDPOINTS = {
  SIGNUP: 'auth/signup',
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  SEND_OTP: 'auth/send-otp',
  VERIFY_OTP: 'auth/verify-otp',
  GOOGLE_LOGIN: 'auth/google',
  RESET_PASSWORD: 'auth/reset-password',
  REFRESH_TOKEN: 'auth/refresh-token',
};

interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SendOtpPayload {
  email: string;
}

interface VerifyOtpPayload {
  email: string;
  code: string;
}

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

function handleAxiosError(error: unknown, fallbackCode: string): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const serverMessage = axiosError.response?.data?.message;
    console.log('Server message', axiosError.response?.data.message);
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

export const signup = async (payload: SignupPayload): Promise<ApiResponse | ApiError> => {
  try {
    const res = await axios.post(`${BASE_URL}/${AUTH_ENDPOINTS.SIGNUP}`, payload);
    return { data: res.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'SIGNUP_ERROR');
  }
};

export const login = async (payload: LoginPayload): Promise<ApiResponse | ApiError> => {
  try {
    const res = await axios.post(`${BASE_URL}/${AUTH_ENDPOINTS.LOGIN}`, payload);
    return { data: res.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'LOGIN_ERROR');
  }
};

export const sendOtp = async (payload: SendOtpPayload): Promise<ApiResponse | ApiError> => {
  try {
    const res = await axios.post(`${BASE_URL}/${AUTH_ENDPOINTS.SEND_OTP}`, payload);
    return { data: res.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'SEND_OTP_ERROR');
  }
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<ApiResponse | ApiError> => {
  try {
    const res = await axios.post(`${BASE_URL}/${AUTH_ENDPOINTS.VERIFY_OTP}`, payload);
    return { data: res.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'VERIFY_OTP_ERROR');
  }
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ApiResponse | ApiError> => {
  try {
    const res = await axios.post(`${BASE_URL}/${AUTH_ENDPOINTS.RESET_PASSWORD}`, payload);
    return { data: res.data, message: res.data.message, success: true };
  } catch (error) {
    return handleAxiosError(error, 'RESET_PASSWORD_ERROR');
  }
};
