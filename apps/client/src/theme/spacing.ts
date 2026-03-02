// Spacing - Padding, Margin, Gaps, Border Radius

// ============================================
// SPACING SCALE (Base unit: 4px)
// ============================================

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// ============================================
// COMMON SPACING VALUES
// ============================================

export const layout = {
  // Screen padding
  screenPaddingHorizontal: spacing[4], // 16
  screenPaddingVertical: spacing[4], // 16

  // Card padding
  cardPadding: spacing[4], // 16
  cardPaddingSmall: spacing[3], // 12

  // Section spacing
  sectionGap: spacing[6], // 24
  sectionGapLarge: spacing[8], // 32

  // Item spacing
  itemGap: spacing[3], // 12
  itemGapSmall: spacing[2], // 8

  // Input
  inputPaddingHorizontal: spacing[4], // 16
  inputPaddingVertical: spacing[3], // 12
  inputHeight: spacing[12], // 48
  inputHeightSmall: spacing[10], // 40

  // Button
  buttonPaddingHorizontal: spacing[6], // 24
  buttonPaddingVertical: spacing[3], // 12
  buttonHeight: spacing[12], // 48
  buttonHeightSmall: spacing[10], // 40
  buttonHeightLarge: spacing[14], // 56

  // Avatar sizes
  avatarSmall: spacing[8], // 32
  avatarMedium: spacing[10], // 40
  avatarLarge: spacing[12], // 48
  avatarXLarge: spacing[16], // 64

  // Icon sizes
  iconSmall: spacing[4], // 16
  iconMedium: spacing[5], // 20
  iconLarge: spacing[6], // 24
  iconXLarge: spacing[8], // 32

  // Bottom tab bar
  tabBarHeight: spacing[16], // 64
  tabBarIconSize: spacing[6], // 24

  // Header
  headerHeight: spacing[14], // 56

  // Modal
  modalPadding: spacing[5], // 20

  // Toast
  toastPadding: spacing[4], // 16
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
} as const;

// Common radius values
export const radius = {
  // Components
  button: borderRadius.lg, // 12
  buttonSmall: borderRadius.md, // 8
  input: borderRadius.lg, // 12
  card: borderRadius.xl, // 16
  modal: borderRadius['2xl'], // 20
  toast: borderRadius.lg, // 12
  badge: borderRadius.full, // pill
  avatar: borderRadius.full, // circular

  // Misc
  chip: borderRadius.full,
  bottomSheet: borderRadius['2xl'], // 20
  image: borderRadius.lg, // 12
} as const;

// ============================================
// BORDER WIDTH
// ============================================

export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
} as const;
