import { Stack } from 'expo-router';
import { colors } from '../../constants/colors';

/**
 * Auth flow layout
 * Contains: Welcome, Login, Signup, OTP, Forgot Password
 * Premium design with consistent backgrounds
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.light.background },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen
        name="signup"
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          contentStyle: { backgroundColor: colors.light.background },
        }}
      />
      <Stack.Screen name="otp" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
