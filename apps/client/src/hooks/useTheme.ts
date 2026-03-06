import { useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  getThemeColors,
  ThemeName,
  ColorMode,
  ThemeColors,
} from "@/theme/colors";
import { spacing, layout, borderRadius, radius } from "@/theme/spacing";
import { fontFamily, fontSize, textStyles } from "@/theme/typography";
import { shadows, componentShadows } from "@/theme/shadows";

// Default theme - baad mein Zustand store se dynamic kar sakte hai
const DEFAULT_THEME: ThemeName = "indigo";

interface UseThemeReturn {
  // Theme identity
  themeName: ThemeName;
  colorMode: ColorMode;

  // Colors
  colors: ThemeColors;

  // Spacing
  spacing: typeof spacing;
  layout: typeof layout;
  borderRadius: typeof borderRadius;
  radius: typeof radius;

  // Typography
  fontFamily: typeof fontFamily;
  fontSize: typeof fontSize;
  textStyles: typeof textStyles;

  // Shadows
  shadows: typeof shadows;
  componentShadows: typeof componentShadows;
}

export const useTheme = (themeName: ThemeName = DEFAULT_THEME): UseThemeReturn => {
  const systemColorScheme = useColorScheme();
  const colorMode: ColorMode = systemColorScheme === "dark" ? "dark" : "light";

  const colors = useMemo(
    () => getThemeColors(themeName, colorMode),
    [themeName, colorMode]
  );

  return {
    themeName,
    colorMode,
    colors,
    spacing,
    layout,
    borderRadius,
    radius,
    fontFamily,
    fontSize,
    textStyles,
    shadows,
    componentShadows,
  };
};

export default useTheme;
