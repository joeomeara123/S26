/**
 * S26 Supernova Color Palette
 * Modern 2026 aesthetic with vibrant energy and karma-positive vibes
 */

export const colors = {
  // Primary - Vibrant energy (Indigo)
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  primaryMuted: '#C7D2FE',

  // Karma Gold - Achievement & progress
  karma: '#F59E0B',
  karmaGlow: '#FCD34D',
  karmaDark: '#D97706',

  // Supernova - Special moment (signature pink)
  supernova: '#EC4899',
  supernovaGlow: '#F472B6',
  supernovaDark: '#DB2777',

  // Feel Good - Positive content marker
  feelGood: '#10B981',
  feelGoodLight: '#34D399',
  feelGoodDark: '#059669',

  // Light Theme
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    surface: '#F3F4F6',
    surfaceElevated: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },

  // Dark Theme
  dark: {
    background: '#0F0F0F',
    backgroundSecondary: '#171717',
    surface: '#1F1F1F',
    surfaceElevated: '#262626',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#374151',
    borderLight: '#1F2937',
  },

  // Semantic Colors
  semantic: {
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#22C55E',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },

  // Cause Colors (charity categories)
  causes: {
    EC: '#22C55E', // Environmental Conservation - Green
    HH: '#EF4444', // Human Health - Red
    HC: '#3B82F6', // Humanitarian Crisis - Blue
    HW: '#8B5CF6', // Human Welfare - Purple
    MH: '#06B6D4', // Mental Health - Cyan
    AW: '#F97316', // Animal Welfare - Orange
  },

  // Gradients (as color stops)
  gradients: {
    primary: ['#6366F1', '#818CF8'],
    karma: ['#F59E0B', '#FCD34D'],
    supernova: ['#EC4899', '#F472B6'],
    sunset: ['#F97316', '#EC4899'],
    ocean: ['#06B6D4', '#3B82F6'],
    spectrum: [
      '#D946A8', // pink (muted)
      '#DC4E5A', // red (warm)
      '#E87B35', // orange
      '#D4A843', // yellow (golden)
      '#3DA87A', // green (muted)
      '#4A7BD4', // blue
      '#8B5DC8', // violet
    ],
  },

  // Auth screen tokens (dark aura aesthetic)
  auth: {
    background: '#0D0D0D',
    grainOpacity: 0.5,
    glassBackground: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    glassBlur: 40,
    textPrimary: '#FAFAFA',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.35)',
    inputBackground: 'rgba(255, 255, 255, 0.06)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// Type for theme-aware color access
export type ColorTheme = 'light' | 'dark';
export type CauseCode = keyof typeof colors.causes;
