import { createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes as tamaguiThemes, tokens as tamaguiTokens } from '@tamagui/config/v3';
import { colors } from './constants/colors';
import { spacing, radius as radiusValues } from './constants/spacing';

// Create Inter font configuration
const interFont = createInterFont();

// Create custom tokens extending Tamagui defaults
const tokens = createTokens({
  ...tamaguiTokens,
  color: {
    ...tamaguiTokens.color,
    // Primary
    primary: colors.primary,
    primaryLight: colors.primaryLight,
    primaryDark: colors.primaryDark,
    primaryMuted: colors.primaryMuted,
    // Karma
    karma: colors.karma,
    karmaGlow: colors.karmaGlow,
    karmaDark: colors.karmaDark,
    // Supernova
    supernova: colors.supernova,
    supernovaGlow: colors.supernovaGlow,
    supernovaDark: colors.supernovaDark,
    // Feel Good
    feelGood: colors.feelGood,
    feelGoodLight: colors.feelGoodLight,
    feelGoodDark: colors.feelGoodDark,
    // Light theme
    lightBackground: colors.light.background,
    lightBackgroundSecondary: colors.light.backgroundSecondary,
    lightSurface: colors.light.surface,
    lightText: colors.light.text,
    lightTextSecondary: colors.light.textSecondary,
    lightBorder: colors.light.border,
    // Dark theme
    darkBackground: colors.dark.background,
    darkBackgroundSecondary: colors.dark.backgroundSecondary,
    darkSurface: colors.dark.surface,
    darkText: colors.dark.text,
    darkTextSecondary: colors.dark.textSecondary,
    darkBorder: colors.dark.border,
    // Semantic
    error: colors.semantic.error,
    success: colors.semantic.success,
    warning: colors.semantic.warning,
    // Causes
    causeEC: colors.causes.EC,
    causeHH: colors.causes.HH,
    causeHC: colors.causes.HC,
    causeHW: colors.causes.HW,
    causeMH: colors.causes.MH,
    causeAW: colors.causes.AW,
  },
  space: {
    ...tamaguiTokens.space,
    xs: spacing['1'],
    sm: spacing['2'],
    md: spacing['4'],
    lg: spacing['6'],
    xl: spacing['8'],
    '2xl': spacing['12'],
    '3xl': spacing['16'],
  },
  radius: {
    ...tamaguiTokens.radius,
    sm: radiusValues.sm,
    md: radiusValues.md,
    lg: radiusValues.lg,
    xl: radiusValues.xl,
    '2xl': radiusValues['2xl'],
    full: radiusValues.full,
  },
});

// Custom themes
const lightTheme = {
  background: tokens.color.lightBackground,
  backgroundHover: tokens.color.lightBackgroundSecondary,
  backgroundPress: tokens.color.lightSurface,
  backgroundFocus: tokens.color.lightBackgroundSecondary,
  color: tokens.color.lightText,
  colorHover: tokens.color.lightText,
  colorPress: tokens.color.lightTextSecondary,
  colorFocus: tokens.color.lightText,
  borderColor: tokens.color.lightBorder,
  borderColorHover: tokens.color.lightBorder,
  borderColorPress: tokens.color.lightBorder,
  borderColorFocus: tokens.color.primary,
  placeholderColor: tokens.color.lightTextSecondary,
};

const darkTheme = {
  background: tokens.color.darkBackground,
  backgroundHover: tokens.color.darkBackgroundSecondary,
  backgroundPress: tokens.color.darkSurface,
  backgroundFocus: tokens.color.darkBackgroundSecondary,
  color: tokens.color.darkText,
  colorHover: tokens.color.darkText,
  colorPress: tokens.color.darkTextSecondary,
  colorFocus: tokens.color.darkText,
  borderColor: tokens.color.darkBorder,
  borderColorHover: tokens.color.darkBorder,
  borderColorPress: tokens.color.darkBorder,
  borderColorFocus: tokens.color.primary,
  placeholderColor: tokens.color.darkTextSecondary,
};

// Create Tamagui config
export const config = createTamagui({
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: interFont,
    body: interFont,
    mono: interFont,
  },
  tokens,
  themes: {
    ...tamaguiThemes,
    light: {
      ...tamaguiThemes.light,
      ...lightTheme,
    },
    dark: {
      ...tamaguiThemes.dark,
      ...darkTheme,
    },
  },
});

export default config;

// TypeScript type export
export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
