// Responsive - Breakpoints and Screen Size Utilities
import { Dimensions } from 'react-native';

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: 0, // Extra small phones
  sm: 360, // Small phones
  md: 400, // Medium phones
  lg: 480, // Large phones
  xl: 600, // Small tablets
  '2xl': 768, // Tablets
  '3xl': 1024, // Large tablets / Desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

// ============================================
// SCREEN DIMENSIONS
// ============================================

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

export const screenDimensions = {
  window: {
    width: window.width,
    height: window.height,
  },
  screen: {
    width: screen.width,
    height: screen.height,
  },
};

// ============================================
// RESPONSIVE HELPERS
// ============================================

/**
 * Check if screen width is at least the given breakpoint
 */
export const isMinWidth = (breakpoint: Breakpoint): boolean => {
  const width = Dimensions.get('window').width;
  return width >= breakpoints[breakpoint];
};

/**
 * Check if screen width is less than the given breakpoint
 */
export const isMaxWidth = (breakpoint: Breakpoint): boolean => {
  const width = Dimensions.get('window').width;
  return width < breakpoints[breakpoint];
};

/**
 * Get current breakpoint name
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  const width = Dimensions.get('window').width;

  if (width >= breakpoints['3xl']) return '3xl';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Get responsive value based on breakpoint
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<Breakpoint, T>> & { default: T }
): T => {
  const currentBreakpoint = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'];

  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp] as T;
    }
  }

  return values.default;
};

// ============================================
// RESPONSIVE SCALE (for scaling based on screen)
// ============================================

const baseWidth = 375; // iPhone SE / standard mobile width
const baseHeight = 812; // iPhone X height

/**
 * Scale width based on screen width (horizontal scaling)
 */
export const scaleWidth = (size: number): number => {
  const { width } = Dimensions.get('window');
  return (width / baseWidth) * size;
};

/**
 * Scale height based on screen height (vertical scaling)
 */
export const scaleHeight = (size: number): number => {
  const { height } = Dimensions.get('window');
  return (height / baseHeight) * size;
};

/**
 * Moderate scale - balanced scaling
 * factor: 0 = no scaling, 0.5 = half scaling, 1 = full scaling
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const { width } = Dimensions.get('window');
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Scale font size with max limit
 */
export const scaleFontSize = (size: number, maxSize?: number): number => {
  const scaled = moderateScale(size, 0.3);
  if (maxSize && scaled > maxSize) {
    return maxSize;
  }
  return Math.round(scaled);
};

// ============================================
// DEVICE TYPE
// ============================================

export const getDeviceType = (): 'phone' | 'tablet' => {
  const { width } = Dimensions.get('window');
  return width >= breakpoints['2xl'] ? 'tablet' : 'phone';
};

export const isPhone = (): boolean => getDeviceType() === 'phone';
export const isTablet = (): boolean => getDeviceType() === 'tablet';

// ============================================
// ORIENTATION
// ============================================

export const getOrientation = (): 'portrait' | 'landscape' => {
  const { width, height } = Dimensions.get('window');
  return height >= width ? 'portrait' : 'landscape';
};

export const isPortrait = (): boolean => getOrientation() === 'portrait';
export const isLandscape = (): boolean => getOrientation() === 'landscape';

// ============================================
// SCREEN INFO TYPE
// ============================================

export interface ScreenInfo {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  deviceType: 'phone' | 'tablet';
  orientation: 'portrait' | 'landscape';
  isSmallPhone: boolean;
  isMediumPhone: boolean;
  isLargePhone: boolean;
  isTablet: boolean;
}

export const getScreenInfo = (): ScreenInfo => {
  const { width, height } = Dimensions.get('window');
  const breakpoint = getCurrentBreakpoint();

  return {
    width,
    height,
    breakpoint,
    deviceType: getDeviceType(),
    orientation: getOrientation(),
    isSmallPhone: width < breakpoints.md,
    isMediumPhone: width >= breakpoints.md && width < breakpoints.lg,
    isLargePhone: width >= breakpoints.lg && width < breakpoints['2xl'],
    isTablet: width >= breakpoints['2xl'],
  };
};
