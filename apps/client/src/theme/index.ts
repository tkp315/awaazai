// Theme Index - Export all theme utilities

// Colors
export * from './colors';

// Typography
export * from './typography';

// Spacing
export * from './spacing';

// Responsive
export * from './responsive';

// Shadows
export * from './shadows';

// ============================================
// COMBINED THEME TYPE
// ============================================

import type { ThemeColors, ThemeName, ColorMode } from './colors';
import { fontFamily, fontSize, textStyles, fontWeight, letterSpacing } from './typography';
import { spacing, layout, borderRadius, radius, borderWidth, zIndex } from './spacing';
import { shadows, componentShadows } from './shadows';
import { breakpoints } from './responsive';

export interface Theme {
  // Identity
  name: ThemeName;
  colorMode: ColorMode;

  // Colors
  colors: ThemeColors;

  // Typography
  fontFamily: typeof fontFamily;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  textStyles: typeof textStyles;
  letterSpacing: typeof letterSpacing;

  // Spacing
  spacing: typeof spacing;
  layout: typeof layout;
  borderRadius: typeof borderRadius;
  radius: typeof radius;
  borderWidth: typeof borderWidth;
  zIndex: typeof zIndex;

  // Shadows
  shadows: typeof shadows;
  componentShadows: typeof componentShadows;

  // Responsive
  breakpoints: typeof breakpoints;
}

// ============================================
// CREATE THEME FUNCTION
// ============================================

import { getThemeColors, defaultTheme, defaultColorMode } from './colors';

export const createTheme = (
  themeName: ThemeName = defaultTheme,
  colorMode: ColorMode = defaultColorMode
): Theme => {
  return {
    name: themeName,
    colorMode,
    colors: getThemeColors(themeName, colorMode),
    fontFamily,
    fontSize,
    fontWeight,
    textStyles,
    letterSpacing,
    spacing,
    layout,
    borderRadius,
    radius,
    borderWidth,
    zIndex,
    shadows,
    componentShadows,
    breakpoints,
  };
};

// Default theme instance
export const defaultThemeInstance = createTheme();
