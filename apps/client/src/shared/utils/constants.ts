// App Constants

export const APP_NAME = 'AwaazAI';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// API
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Voice
export const MAX_VOICE_SAMPLES = 10;
export const MIN_SAMPLE_DURATION = 10; // seconds
export const MAX_SAMPLE_DURATION = 60; // seconds
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'm4a'];

// Chat
export const MAX_MESSAGE_LENGTH = 2000;

// File Sizes
export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  AUDIO: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
} as const;

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  OTP: /^\d{6}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input.',
} as const;
