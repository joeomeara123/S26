/**
 * S26 Supernova Spacing & Layout System
 * 8-point grid system for consistent spacing
 */

// Base spacing scale (multiples of 4)
export const spacing = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
} as const;

// Semantic spacing aliases
export const space = {
  // Micro spacing
  xs: spacing['1'],      // 4
  sm: spacing['2'],      // 8
  md: spacing['4'],      // 16
  lg: spacing['6'],      // 24
  xl: spacing['8'],      // 32
  '2xl': spacing['12'],  // 48
  '3xl': spacing['16'],  // 64

  // Component-specific
  screenPadding: spacing['4'],        // 16
  cardPadding: spacing['4'],          // 16
  inputPadding: spacing['3'],         // 12
  buttonPaddingX: spacing['6'],       // 24
  buttonPaddingY: spacing['3'],       // 12
  iconMargin: spacing['2'],           // 8
  sectionGap: spacing['8'],           // 32
  listItemGap: spacing['3'],          // 12
} as const;

// Border radius
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Touch target sizes (accessibility minimum: 44x44)
export const touchTargets = {
  small: 36,   // Icons only, use with caution
  medium: 44,  // Standard buttons, icons with touch area
  large: 56,   // Primary actions
} as const;

// Layout dimensions
export const layout = {
  // Screen dimensions
  maxContentWidth: 600,

  // Tab bar
  tabBarHeight: 84,  // 56 + safe area
  tabBarIconSize: 24,

  // Navigation header
  headerHeight: 56,

  // Bottom sheet snap points
  sheetSnapSmall: '25%',
  sheetSnapMedium: '50%',
  sheetSnapLarge: '90%',

  // Avatar sizes
  avatarXS: 24,
  avatarSM: 32,
  avatarMD: 40,
  avatarLG: 56,
  avatarXL: 80,
  avatarProfile: 120,
} as const;

// Animation durations (ms)
export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

// Shadows (iOS style)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
