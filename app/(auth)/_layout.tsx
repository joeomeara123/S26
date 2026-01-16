import { Stack } from 'expo-router';

/**
 * Auth flow layout
 * Contains: Welcome, Login, Signup, OTP, Forgot Password
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen
        name="signup"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="otp" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
