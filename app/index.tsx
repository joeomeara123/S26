import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

/**
 * Root index - redirects based on auth state
 * - Not authenticated → Welcome screen
 * - Authenticated but new user → Onboarding
 * - Authenticated returning user → Home feed
 */
export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}
