import { Stack } from 'expo-router';

/**
 * Onboarding flow layout
 * For first-time users after signup
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent swipe back during onboarding
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="choose-cause" />
      <Stack.Screen name="follow-people" />
    </Stack>
  );
}
