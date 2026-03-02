// Shadows - Shadow presets for elevation
import { Platform, ViewStyle } from 'react-native';

// ============================================
// SHADOW TYPES
// ============================================

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// ============================================
// SHADOW PRESETS
// ============================================

const createShadow = (
  offsetY: number,
  shadowRadius: number,
  shadowOpacity: number,
  elevation: number
): Shadow => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity,
  shadowRadius,
  elevation,
});

export const shadows = {
  // No shadow
  none: createShadow(0, 0, 0, 0),

  // Extra small - subtle
  xs: createShadow(1, 2, 0.05, 1),

  // Small - cards, buttons
  sm: createShadow(1, 3, 0.1, 2),

  // Medium - dropdowns, popovers
  md: createShadow(4, 6, 0.1, 4),

  // Large - modals
  lg: createShadow(10, 15, 0.1, 8),

  // Extra large - floating elements
  xl: createShadow(20, 25, 0.15, 12),

  // 2XL - prominent elements
  '2xl': createShadow(25, 50, 0.25, 16),
} as const;

// ============================================
// COLORED SHADOWS
// ============================================

export const createColoredShadow = (color: string, size: keyof typeof shadows = 'md'): Shadow => {
  const base = shadows[size];
  return {
    ...base,
    shadowColor: color,
  };
};

// ============================================
// COMPONENT-SPECIFIC SHADOWS
// ============================================

export const componentShadows = {
  // Card shadow
  card: shadows.sm,

  // Elevated card
  cardElevated: shadows.md,

  // Button shadow
  button: shadows.xs,
  buttonPressed: shadows.none,

  // Input focus shadow (usually glow effect)
  inputFocus: {
    ...shadows.sm,
    shadowColor: '#6366f1', // Will be overridden by theme
    shadowOpacity: 0.3,
  },

  // Modal shadow
  modal: shadows.xl,

  // Bottom sheet shadow
  bottomSheet: shadows.lg,

  // Dropdown shadow
  dropdown: shadows.md,

  // Toast shadow
  toast: shadows.lg,

  // FAB (Floating Action Button)
  fab: shadows.lg,

  // Tab bar shadow
  tabBar: {
    ...shadows.sm,
    shadowOffset: { width: 0, height: -2 },
  },

  // Header shadow
  header: shadows.sm,
} as const;

// ============================================
// PLATFORM-SPECIFIC SHADOW
// ============================================

/**
 * Get platform-specific shadow style
 * iOS uses shadow properties, Android uses elevation
 */
export const getPlatformShadow = (shadow: Shadow): ViewStyle => {
  if (Platform.OS === 'android') {
    return {
      elevation: shadow.elevation,
    };
  }

  return {
    shadowColor: shadow.shadowColor,
    shadowOffset: shadow.shadowOffset,
    shadowOpacity: shadow.shadowOpacity,
    shadowRadius: shadow.shadowRadius,
  };
};

// ============================================
// INNER SHADOW (for pressed states)
// ============================================

// Note: React Native doesn't support inner shadows natively
// This is a placeholder for potential workarounds
export const innerShadows = {
  sm: {
    // Would need a wrapper view with negative margins
    // or use a library like react-native-shadow-2
  },
} as const;
