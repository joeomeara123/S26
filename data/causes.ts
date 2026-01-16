/**
 * Charity Causes Data
 * The six "For Good" causes supported by Supernova
 */

import { CauseCode, colors } from '../constants/colors';

export interface Cause {
  code: CauseCode;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  impact: string;
  totalRaised: number;
  activeUsers: number;
}

export const causes: Record<CauseCode, Cause> = {
  EC: {
    code: 'EC',
    name: 'Environmental Conservation',
    shortName: 'Environment',
    description: 'Protecting our planet through conservation efforts, reforestation, and sustainable practices.',
    icon: '🌍',
    color: colors.causes.EC,
    impact: 'Every Supernova plants 1 tree',
    totalRaised: 2450000,
    activeUsers: 45000,
  },
  HH: {
    code: 'HH',
    name: 'Human Health',
    shortName: 'Health',
    description: 'Supporting medical research, healthcare access, and disease prevention worldwide.',
    icon: '❤️',
    color: colors.causes.HH,
    impact: 'Fund medical research & care',
    totalRaised: 3200000,
    activeUsers: 52000,
  },
  HC: {
    code: 'HC',
    name: 'Humanitarian Crisis',
    shortName: 'Humanitarian',
    description: 'Providing emergency relief and support to communities affected by disasters and conflicts.',
    icon: '🤝',
    color: colors.causes.HC,
    impact: 'Deliver emergency supplies',
    totalRaised: 1890000,
    activeUsers: 38000,
  },
  HW: {
    code: 'HW',
    name: 'Human Welfare',
    shortName: 'Welfare',
    description: 'Improving quality of life through education, housing, and community development.',
    icon: '🏠',
    color: colors.causes.HW,
    impact: 'Build homes & schools',
    totalRaised: 2100000,
    activeUsers: 41000,
  },
  MH: {
    code: 'MH',
    name: 'Mental Health',
    shortName: 'Mental Health',
    description: 'Promoting mental wellness, therapy access, and reducing stigma around mental health.',
    icon: '🧠',
    color: colors.causes.MH,
    impact: 'Fund therapy & support',
    totalRaised: 1560000,
    activeUsers: 67000,
  },
  AW: {
    code: 'AW',
    name: 'Animal Welfare',
    shortName: 'Animals',
    description: 'Protecting animals through rescue, rehabilitation, and habitat preservation.',
    icon: '🐾',
    color: colors.causes.AW,
    impact: 'Rescue & care for animals',
    totalRaised: 1780000,
    activeUsers: 49000,
  },
};

// Get all causes as array
export const getAllCauses = (): Cause[] => {
  return Object.values(causes);
};

// Get cause by code
export const getCauseByCode = (code: CauseCode): Cause => {
  return causes[code];
};

// Format currency
export const formatMoney = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};
