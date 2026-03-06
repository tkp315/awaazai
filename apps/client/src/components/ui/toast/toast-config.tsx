// Toast Configuration - Custom toast designs

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ToastConfigParams } from 'react-native-toast-message';

// ============================================
// TOAST STYLES
// ============================================

const toastStyles = {
  success: {
    iconBg: '#16a34a',
    iconName: 'checkmark' as const,
    accent: '#22c55e',
    label: 'Success',
  },
  error: {
    iconBg: '#dc2626',
    iconName: 'close' as const,
    accent: '#ef4444',
    label: 'Error',
  },
  warning: {
    iconBg: '#d97706',
    iconName: 'warning-outline' as const,
    accent: '#f59e0b',
    label: 'Warning',
  },
  info: {
    iconBg: '#2563eb',
    iconName: 'information' as const,
    accent: '#3b82f6',
    label: 'Info',
  },
};

// ============================================
// BASE TOAST COMPONENT
// ============================================

interface BaseToastProps {
  type: keyof typeof toastStyles;
  text1?: string;
  text2?: string;
  onPress?: () => void;
  hide?: () => void;
}

const BaseToast = ({ type, text1, text2, onPress, hide }: BaseToastProps) => {
  const style = toastStyles[type];

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '92%',
        maxWidth: 420,
        backgroundColor: '#0f172a',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Icon Circle */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: style.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Ionicons name={style.iconName} size={18} color="#fff" />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#f8fafc',
            letterSpacing: 0.1,
          }}
          numberOfLines={1}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              fontSize: 12,
              color: '#94a3b8',
              marginTop: 2,
              lineHeight: 16,
            }}
            numberOfLines={2}
          >
            {text2}
          </Text>
        )}
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Close */}
      <Pressable onPress={hide} hitSlop={10}>
        <Ionicons name="close" size={16} color="#64748b" />
      </Pressable>
    </Pressable>
  );
};

// ============================================
// TOAST CONFIG
// ============================================

export const toastConfig = {
  success: ({ text1, text2, onPress, hide }: ToastConfigParams<unknown>) => (
    <BaseToast type="success" text1={text1} text2={text2} onPress={onPress} hide={hide} />
  ),
  error: ({ text1, text2, onPress, hide }: ToastConfigParams<unknown>) => (
    <BaseToast type="error" text1={text1} text2={text2} onPress={onPress} hide={hide} />
  ),
  warning: ({ text1, text2, onPress, hide }: ToastConfigParams<unknown>) => (
    <BaseToast type="warning" text1={text1} text2={text2} onPress={onPress} hide={hide} />
  ),
  info: ({ text1, text2, onPress, hide }: ToastConfigParams<unknown>) => (
    <BaseToast type="info" text1={text1} text2={text2} onPress={onPress} hide={hide} />
  ),
};
