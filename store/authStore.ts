import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  karma: number;
  cause?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Mock user data for demo
const createMockUser = (email: string, name: string): User => ({
  id: `user_${Date.now()}`,
  email,
  name,
  username: name.toLowerCase().replace(/\s+/g, '_'),
  karma: 0,
  avatar: undefined,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      isLoading: false,

      // Mock login - accepts any credentials for demo
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock successful login
        const user = createMockUser(email, email.split('@')[0]);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Mock signup
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock successful signup - needs OTP verification
        const user = createMockUser(email, name);
        set({
          user,
          isAuthenticated: false, // Not yet until OTP
          isLoading: false,
        });
      },

      // Mock OTP verification
      verifyOTP: async (code: string) => {
        set({ isLoading: true });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Accept any 6-digit code for demo
        const isValid = code.length === 6;

        if (isValid) {
          set({
            isAuthenticated: true,
            hasCompletedOnboarding: false, // New user needs onboarding
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }

        return isValid;
      },

      // Logout
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
        });
      },

      // Mark onboarding as complete
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      // Update user profile
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'supernova-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
