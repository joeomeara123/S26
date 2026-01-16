# S26 Supernova - Project Instructions

## Project Overview

**S26 Supernova** is a social media platform enhancement focused on improving user retention through engaging UI/UX, TikTok-style video feeds, and a unique "For Good" karma/charity system.

**Approach**: Frontend-First Demo with mock data → Backend later
**Goal**: Complete visual experience with animations, ready to demo

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54 + React Native 0.81 |
| Navigation | Expo Router (file-based) |
| Styling | Tamagui (compiled styles) |
| Animations | React Native Reanimated 3, Moti |
| State | Zustand |
| Lists | @shopify/flash-list |
| Video | expo-video |

## Project Structure

```
S26/
├── app/                      # Expo Router screens
│   ├── (auth)/               # Auth flow (welcome, login, signup)
│   ├── (onboarding)/         # First-time user flow
│   ├── (tabs)/               # Main app tabs
│   └── _layout.tsx           # Root layout with providers
├── components/               # Reusable components
│   ├── ui/                   # Base UI (Button, Input, Card)
│   ├── video/                # Video player components
│   ├── post/                 # Post card, carousel
│   ├── karma/                # Karma bar, animations
│   └── auth/                 # OTP input, social buttons
├── constants/                # Design system tokens
│   ├── colors.ts             # Color palette (light/dark)
│   ├── typography.ts         # Font styles
│   └── spacing.ts            # Spacing scale
├── data/                     # Mock data
│   ├── users.ts              # Fake users
│   ├── posts.ts              # Fake posts
│   └── causes.ts             # Charity causes
├── hooks/                    # Custom hooks
├── store/                    # Zustand stores
├── assets/                   # Images, videos, fonts
└── docs/prd/                 # PRDs and user stories
```

## Development Commands

```bash
# Start development
npm start                     # Start Metro bundler
npm run ios                   # Open in iOS simulator

# Quality checks
npm run typecheck             # TypeScript validation
npm run lint                  # ESLint

# Cleanup
npm run clean                 # Clear caches
```

## Design System

### Colors
- **Primary**: #6366F1 (Indigo)
- **Karma**: #F59E0B (Amber gold)
- **Supernova**: #EC4899 (Pink - signature moment)
- **Feel Good**: #10B981 (Emerald)

### Causes (Charity Categories)
| Code | Name | Color |
|------|------|-------|
| EC | Environmental Conservation | Green #22C55E |
| HH | Human Health | Red #EF4444 |
| HC | Humanitarian Crisis | Blue #3B82F6 |
| HW | Human Welfare | Purple #8B5CF6 |
| MH | Mental Health | Cyan #06B6D4 |
| AW | Animal Welfare | Orange #F97316 |

## Coding Conventions

### Component Structure
```tsx
// components/ui/Button.tsx
import { styled, Button as TButton } from 'tamagui';

export const Button = styled(TButton, {
  // Base styles
  backgroundColor: '$primary',
  borderRadius: '$md',

  // Variants
  variants: {
    size: {
      sm: { height: 36, paddingHorizontal: '$3' },
      md: { height: 44, paddingHorizontal: '$4' },
      lg: { height: 56, paddingHorizontal: '$6' },
    },
    variant: {
      primary: { backgroundColor: '$primary' },
      secondary: { backgroundColor: '$backgroundSecondary' },
      ghost: { backgroundColor: 'transparent' },
    },
  },

  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});
```

### Animation Pattern (Moti)
```tsx
import { MotiView } from 'moti';

// Fade in animation
<MotiView
  from={{ opacity: 0, translateY: 10 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 300 }}
>
  {children}
</MotiView>
```

### State Management (Zustand)
```tsx
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // Mock auth - just set user
    set({ user: { email, name: 'Demo User' }, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## Accessibility Requirements

**MANDATORY for all interactive elements:**
- Touch targets: ≥44x44pt
- Color contrast: WCAG AA (4.5:1)
- `accessibilityLabel` on all buttons/icons
- `accessibilityRole` on interactive elements

## Verification Strategy

1. **TypeScript**: `npm run typecheck` before every commit
2. **Visual**: Use ios-simulator-mcp for screenshots
3. **Animation**: Check 60fps with Perf Monitor

## Git Workflow

```bash
# Branches
main              # Protected, stable releases
develop           # Integration branch
feature/week-X-*  # Feature branches

# Commit format
feat: [PRD-XX] Story title - description
fix: Bug description
style: UI polish for [screen]
```

## Learnings (Compound Loop)

Add learnings here as we discover them:

- 2026-01-16: Expo SDK 54 uses React 19.1 - may need `--legacy-peer-deps` for some packages
- 2026-01-16: Tamagui babel plugin MUST come before reanimated/plugin in babel.config.js

## MCP Integration

For visual verification, use:
- `ios-simulator-mcp` - iOS simulator screenshots and interaction
- `XcodeBuildMCP` - Build and test iOS apps

## Mock Data Strategy

All data is mock for the frontend demo:
- User avatars from UIFaces or RandomUser.me
- Videos from Pexels (vertical format)
- Posts with realistic content variety
- Karma/Supernova counts as static values

## Performance Targets

| Metric | Target |
|--------|--------|
| App launch | <2 seconds |
| Video time-to-first-frame | <500ms |
| Scroll FPS | 60 FPS |
| Bundle size | <50MB |
