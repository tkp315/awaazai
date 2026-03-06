// Toast Helper Functions

import Toast from 'react-native-toast-message';

// ============================================
// TYPES
// ============================================

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
}

// ============================================
// TOAST HELPERS
// ============================================

export const toast = {
  // Success toast
  success: ({ title, message, duration = 4000, onPress }: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: duration,
      onPress,
    });
  },

  // Error toast
  error: ({ title, message, duration = 5000, onPress }: ToastOptions) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: duration,
      onPress,
    });
  },

  // Warning toast
  warning: ({ title, message, duration = 4000, onPress }: ToastOptions) => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      visibilityTime: duration,
      onPress,
    });
  },

  // Info toast
  info: ({ title, message, duration = 4000, onPress }: ToastOptions) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: duration,
      onPress,
    });
  },

  // Hide toast
  hide: () => Toast.hide(),

  // ============================================
  // COMMON TOASTS (Shorthand)
  // ============================================

  // Network error
  networkError: () => {
    toast.error({
      title: 'Network Error',
      message: 'Please check your internet connection',
    });
  },

  // Server error
  serverError: () => {
    toast.error({
      title: 'Server Error',
      message: 'Something went wrong. Please try again.',
    });
  },

  // Session expired
  sessionExpired: () => {
    toast.warning({
      title: 'Session Expired',
      message: 'Please login again',
    });
  },

  // Saved
  saved: (item?: string) => {
    toast.success({
      title: 'Saved',
      message: item ? `${item} saved successfully` : undefined,
    });
  },

  // Deleted
  deleted: (item?: string) => {
    toast.success({
      title: 'Deleted',
      message: item ? `${item} deleted successfully` : undefined,
    });
  },

  // Copied
  copied: () => {
    toast.success({ title: 'Copied to clipboard', duration: 2000 });
  },

  // Coming soon
  comingSoon: () => {
    toast.info({
      title: 'Coming Soon',
      message: 'This feature will be available soon',
    });
  },
};
