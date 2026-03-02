// Theme Colors - 4 Color Themes with Light/Dark Mode

// ============================================
// THEME TYPES
// ============================================

export type ThemeName = 'indigo' | 'violet' | 'blue' | 'emerald';
export type ColorMode = 'light' | 'dark';

export interface ThemeColors {
  // Primary
  primary: ColorScale;
  // Secondary (Accent)
  secondary: ColorScale;
  // Semantic
  success: SemanticColor;
  warning: SemanticColor;
  error: SemanticColor;
  info: SemanticColor;
  // Neutral
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderFocus: string;
  // Special
  overlay: string;
  skeleton: string;
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Main
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

interface SemanticColor {
  light: string;
  main: string;
  dark: string;
}

// ============================================
// COLOR SCALES (Tailwind-based)
// ============================================

const indigo: ColorScale = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
};

const amber: ColorScale = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
};

const violet: ColorScale = {
  50: '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
  950: '#2e1065',
};

const cyan: ColorScale = {
  50: '#ecfeff',
  100: '#cffafe',
  200: '#a5f3fc',
  300: '#67e8f9',
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
  700: '#0e7490',
  800: '#155e75',
  900: '#164e63',
  950: '#083344',
};

const blue: ColorScale = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
};

const orange: ColorScale = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
  950: '#431407',
};

const emerald: ColorScale = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  950: '#022c22',
};

const rose: ColorScale = {
  50: '#fff1f2',
  100: '#ffe4e6',
  200: '#fecdd3',
  300: '#fda4af',
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
  700: '#be123c',
  800: '#9f1239',
  900: '#881337',
  950: '#4c0519',
};

// Neutral colors
const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

// ============================================
// SEMANTIC COLORS
// ============================================

const semanticColors = {
  success: {
    light: '#dcfce7',
    main: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#2563eb',
  },
};

// ============================================
// THEME DEFINITIONS
// ============================================

// Theme 1: Indigo + Amber (Default)
const indigoTheme = {
  light: {
    primary: indigo,
    secondary: amber,
    ...semanticColors,
    background: '#ffffff',
    surface: slate[50],
    surfaceHover: slate[100],
    text: slate[900],
    textMuted: slate[500],
    textInverse: '#ffffff',
    border: slate[200],
    borderFocus: indigo[500],
    overlay: 'rgba(15, 23, 42, 0.5)',
    skeleton: slate[200],
  } as ThemeColors,
  dark: {
    primary: indigo,
    secondary: amber,
    ...semanticColors,
    background: slate[950],
    surface: slate[900],
    surfaceHover: slate[800],
    text: slate[50],
    textMuted: slate[400],
    textInverse: slate[900],
    border: slate[700],
    borderFocus: indigo[400],
    overlay: 'rgba(0, 0, 0, 0.7)',
    skeleton: slate[700],
  } as ThemeColors,
};

// Theme 2: Violet + Cyan
const violetTheme = {
  light: {
    primary: violet,
    secondary: cyan,
    ...semanticColors,
    background: '#ffffff',
    surface: slate[50],
    surfaceHover: slate[100],
    text: slate[900],
    textMuted: slate[500],
    textInverse: '#ffffff',
    border: slate[200],
    borderFocus: violet[500],
    overlay: 'rgba(15, 23, 42, 0.5)',
    skeleton: slate[200],
  } as ThemeColors,
  dark: {
    primary: violet,
    secondary: cyan,
    ...semanticColors,
    background: slate[950],
    surface: slate[900],
    surfaceHover: slate[800],
    text: slate[50],
    textMuted: slate[400],
    textInverse: slate[900],
    border: slate[700],
    borderFocus: violet[400],
    overlay: 'rgba(0, 0, 0, 0.7)',
    skeleton: slate[700],
  } as ThemeColors,
};

// Theme 3: Blue + Orange
const blueTheme = {
  light: {
    primary: blue,
    secondary: orange,
    ...semanticColors,
    background: '#ffffff',
    surface: slate[50],
    surfaceHover: slate[100],
    text: slate[900],
    textMuted: slate[500],
    textInverse: '#ffffff',
    border: slate[200],
    borderFocus: blue[500],
    overlay: 'rgba(15, 23, 42, 0.5)',
    skeleton: slate[200],
  } as ThemeColors,
  dark: {
    primary: blue,
    secondary: orange,
    ...semanticColors,
    background: slate[950],
    surface: slate[900],
    surfaceHover: slate[800],
    text: slate[50],
    textMuted: slate[400],
    textInverse: slate[900],
    border: slate[700],
    borderFocus: blue[400],
    overlay: 'rgba(0, 0, 0, 0.7)',
    skeleton: slate[700],
  } as ThemeColors,
};

// Theme 4: Emerald + Rose
const emeraldTheme = {
  light: {
    primary: emerald,
    secondary: rose,
    ...semanticColors,
    background: '#ffffff',
    surface: slate[50],
    surfaceHover: slate[100],
    text: slate[900],
    textMuted: slate[500],
    textInverse: '#ffffff',
    border: slate[200],
    borderFocus: emerald[500],
    overlay: 'rgba(15, 23, 42, 0.5)',
    skeleton: slate[200],
  } as ThemeColors,
  dark: {
    primary: emerald,
    secondary: rose,
    ...semanticColors,
    background: slate[950],
    surface: slate[900],
    surfaceHover: slate[800],
    text: slate[50],
    textMuted: slate[400],
    textInverse: slate[900],
    border: slate[700],
    borderFocus: emerald[400],
    overlay: 'rgba(0, 0, 0, 0.7)',
    skeleton: slate[700],
  } as ThemeColors,
};

// ============================================
// THEME MAP
// ============================================

export const themes: Record<ThemeName, { light: ThemeColors; dark: ThemeColors }> = {
  indigo: indigoTheme,
  violet: violetTheme,
  blue: blueTheme,
  emerald: emeraldTheme,
};

// Default theme
export const defaultTheme: ThemeName = 'indigo';
export const defaultColorMode: ColorMode = 'light';

// Get theme colors
export const getThemeColors = (
  themeName: ThemeName = defaultTheme,
  colorMode: ColorMode = defaultColorMode
): ThemeColors => {
  return themes[themeName][colorMode];
};

// Theme metadata for UI
export const themeOptions: Array<{
  name: ThemeName;
  label: string;
  primary: string;
  secondary: string;
}> = [
  { name: 'indigo', label: 'Indigo & Amber', primary: indigo[500], secondary: amber[500] },
  { name: 'violet', label: 'Violet & Cyan', primary: violet[500], secondary: cyan[500] },
  { name: 'blue', label: 'Blue & Orange', primary: blue[500], secondary: orange[500] },
  { name: 'emerald', label: 'Emerald & Rose', primary: emerald[500], secondary: rose[500] },
];
