// Typography - Font families, sizes, weights

// ============================================
// FONT FAMILIES
// ============================================

export const fontFamily = {
  // System fonts (no need to load)
  system: 'System',

  // Inter font family (need to load via expo-font)
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',

  // Mono for code
  mono: 'SpaceMono-Regular',
} as const;

// ============================================
// FONT SIZES
// ============================================

export const fontSize = {
  // Extra small - captions, labels
  xs: {
    size: 12,
    lineHeight: 16,
  },
  // Small - secondary text
  sm: {
    size: 14,
    lineHeight: 20,
  },
  // Base - body text
  base: {
    size: 16,
    lineHeight: 24,
  },
  // Large - emphasized text
  lg: {
    size: 18,
    lineHeight: 28,
  },
  // Extra large - small headings
  xl: {
    size: 20,
    lineHeight: 28,
  },
  // 2XL - section headings
  '2xl': {
    size: 24,
    lineHeight: 32,
  },
  // 3XL - page titles
  '3xl': {
    size: 30,
    lineHeight: 36,
  },
  // 4XL - hero text
  '4xl': {
    size: 36,
    lineHeight: 40,
  },
  // 5XL - large display
  '5xl': {
    size: 48,
    lineHeight: 48,
  },
} as const;

// ============================================
// FONT WEIGHTS
// ============================================

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// ============================================
// TEXT STYLES (Pre-composed)
// ============================================

export const textStyles = {
  // Display
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['5xl'].size,
    lineHeight: fontSize['5xl'].lineHeight,
    fontWeight: fontWeight.bold,
  },
  displayMedium: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['4xl'].size,
    lineHeight: fontSize['4xl'].lineHeight,
    fontWeight: fontWeight.bold,
  },
  displaySmall: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'].size,
    lineHeight: fontSize['3xl'].lineHeight,
    fontWeight: fontWeight.bold,
  },

  // Headings
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'].size,
    lineHeight: fontSize['3xl'].lineHeight,
    fontWeight: fontWeight.bold,
  },
  h2: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize['2xl'].size,
    lineHeight: fontSize['2xl'].lineHeight,
    fontWeight: fontWeight.semibold,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl.size,
    lineHeight: fontSize.xl.lineHeight,
    fontWeight: fontWeight.semibold,
  },
  h4: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg.size,
    lineHeight: fontSize.lg.lineHeight,
    fontWeight: fontWeight.semibold,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg.size,
    lineHeight: fontSize.lg.lineHeight,
    fontWeight: fontWeight.regular,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base.size,
    lineHeight: fontSize.base.lineHeight,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm.size,
    lineHeight: fontSize.sm.lineHeight,
    fontWeight: fontWeight.regular,
  },

  // Labels
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base.size,
    lineHeight: fontSize.base.lineHeight,
    fontWeight: fontWeight.medium,
  },
  labelMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm.size,
    lineHeight: fontSize.sm.lineHeight,
    fontWeight: fontWeight.medium,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs.size,
    lineHeight: fontSize.xs.lineHeight,
    fontWeight: fontWeight.medium,
  },

  // Caption
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs.size,
    lineHeight: fontSize.xs.lineHeight,
    fontWeight: fontWeight.regular,
  },

  // Button
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base.size,
    lineHeight: fontSize.base.lineHeight,
    fontWeight: fontWeight.semibold,
  },
  buttonSmall: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm.size,
    lineHeight: fontSize.sm.lineHeight,
    fontWeight: fontWeight.semibold,
  },
} as const;

// ============================================
// LETTER SPACING
// ============================================

export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;
