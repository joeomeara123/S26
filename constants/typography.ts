/**
 * S26 Supernova Typography System
 * Based on Inter font family for clean, modern readability
 */

export const fontFamily = {
  // Inter font variants (loaded via expo-font)
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  black: 'Inter-Black',
} as const;

export const fontSize = {
  // Extra small - captions, timestamps
  xs: 12,
  // Small - secondary text, metadata
  sm: 14,
  // Base - body text
  base: 16,
  // Large - emphasized body
  lg: 18,
  // XL - section headers
  xl: 20,
  // 2XL - card titles
  '2xl': 24,
  // 3XL - page headers
  '3xl': 30,
  // 4XL - hero text
  '4xl': 36,
  // 5XL - splash/welcome
  '5xl': 48,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
} as const;

// Pre-defined text styles for consistency
export const textStyles = {
  // Headlines
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.tight,
  },
  h4: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.normal,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.relaxed,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },

  // Labels & UI
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
  },

  // Buttons
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
  },
  buttonSmall: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },

  // Captions
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
  },
} as const;
