// Toast Configuration - Custom toast designs

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ToastConfigParams } from 'react-native-toast-message';

// ============================================
// TOAST COLORS
// ============================================

const toastStyles = {
  success: {
    bg: '#dcfce7',
    border: '#22c55e',
    icon: '#16a34a',
    iconName: 'checkmark-circle' as const,
  },
  error: {
    bg: '#fee2e2',
    border: '#ef4444',
    icon: '#dc2626',
    iconName: 'close-circle' as const,
  },
  warning: {
    bg: '#fef3c7',
    border: '#f59e0b',
    icon: '#d97706',
    iconName: 'warning' as const,
  },
  info: {
    bg: '#dbeafe',
    border: '#3b82f6',
    icon: '#2563eb',
    iconName: 'information-circle' as const,
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
        width: '90%',
        maxWidth: 400,
        backgroundColor: style.bg,
        borderLeftWidth: 4,
        borderLeftColor: style.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Icon */}
      <Ionicons
        name={style.iconName}
        size={24}
        color={style.icon}
        style={{ marginRight: 12, marginTop: 2 }}
      />

      {/* Content */}
      <View style={{ flex: 1 }}>
        {text1 && (
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: text2 ? 4 : 0,
            }}
          >
            {text1}
          </Text>
        )}
        {text2 && <Text style={{ fontSize: 13, color: '#64748b' }}>{text2}</Text>}
      </View>

      {/* Close Button */}
      <Pressable onPress={hide} hitSlop={8} style={{ padding: 4 }}>
        <Ionicons name="close" size={18} color="#94a3b8" />
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
