import { createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes as tamaguiThemes } from '@tamagui/themes';
import { createAnimations } from '@tamagui/animations-react-native';
import { colors } from './constants/colors';
import { spacing, radius as radiusValues } from './constants/spacing';

// Create React Native animations (no worklets needed)
const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  fast: {
    type: 'timing',
    duration: 150,
  },
  medium: {
    type: 'timing',
    duration: 300,
  },
  slow: {
    type: 'timing',
    duration: 500,
  },
});

// Create Inter font configuration
const interFont = createInterFont();

// Create custom tokens from scratch (no @tamagui/config dependency)
const tokens = createTokens({
  color: {
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
    // Base colors needed by Tamagui
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    true: 16,
    xs: spacing['1'],
    sm: spacing['2'],
    md: spacing['4'],
    lg: spacing['6'],
    xl: spacing['8'],
    '2xl': spacing['12'],
    '3xl': spacing['16'],
  },
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    true: 44,
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    true: 12,
    sm: radiusValues.sm,
    md: radiusValues.md,
    lg: radiusValues.lg,
    xl: radiusValues.xl,
    '2xl': radiusValues['2xl'],
    full: radiusValues.full,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
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
  animations,
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
