import { useState, useCallback } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Input, Spinner } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Eye, EyeOff } from '@tamagui/lucide-icons';

import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

/**
 * Login Screen
 * Email/password login with social options
 */
export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await login(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (e) {
      setError('Invalid email or password');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [email, password, login, router]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingTop={insets.top}
        paddingBottom={insets.bottom + spacing['4']}
        paddingHorizontal={spacing['6']}
      >
        {/* Header */}
        <XStack alignItems="center" paddingVertical={spacing['4']}>
          <Button
            size="$4"
            circular
            backgroundColor="transparent"
            icon={<ChevronLeft size={24} color={colors.light.text} />}
            onPress={handleBack}
            accessibilityLabel="Go back"
          />
        </XStack>

        {/* Content */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.content}
        >
          <YStack gap={spacing['2']} marginBottom={spacing['8']}>
            <Text fontSize={32} fontWeight="700" color="$color">
              Welcome back
            </Text>
            <Text fontSize={16} color="$colorPress">
              Sign in to continue your journey
            </Text>
          </YStack>

          {/* Form */}
          <YStack gap={spacing['4']}>
            {/* Email Input */}
            <YStack gap={spacing['2']}>
              <Text fontSize={14} fontWeight="500" color="$color">
                Email
              </Text>
              <Input
                size="$5"
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                borderRadius={12}
                backgroundColor="$backgroundHover"
                borderWidth={1}
                borderColor="$borderColor"
                focusStyle={{ borderColor: colors.primary }}
                accessibilityLabel="Email address"
              />
            </YStack>

            {/* Password Input */}
            <YStack gap={spacing['2']}>
              <Text fontSize={14} fontWeight="500" color="$color">
                Password
              </Text>
              <XStack alignItems="center">
                <Input
                  flex={1}
                  size="$5"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  borderRadius={12}
                  backgroundColor="$backgroundHover"
                  borderWidth={1}
                  borderColor="$borderColor"
                  focusStyle={{ borderColor: colors.primary }}
                  accessibilityLabel="Password"
                />
                <Button
                  position="absolute"
                  right={8}
                  size="$3"
                  circular
                  backgroundColor="transparent"
                  icon={
                    showPassword ? (
                      <EyeOff size={20} color={colors.light.textSecondary} />
                    ) : (
                      <Eye size={20} color={colors.light.textSecondary} />
                    )
                  }
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                />
              </XStack>
            </YStack>

            {/* Forgot Password */}
            <Button
              alignSelf="flex-end"
              backgroundColor="transparent"
              color={colors.primary}
              fontSize={14}
              onPress={() => router.push('/(auth)/forgot-password')}
              accessibilityLabel="Forgot password"
            >
              Forgot password?
            </Button>

            {/* Error Message */}
            {error && (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Text color={colors.semantic.error} fontSize={14} textAlign="center">
                  {error}
                </Text>
              </MotiView>
            )}

            {/* Login Button */}
            <Button
              size="$5"
              backgroundColor={colors.primary}
              color="white"
              fontWeight="600"
              borderRadius={16}
              marginTop={spacing['4']}
              pressStyle={{ scale: 0.98, opacity: 0.9 }}
              disabled={isLoading}
              onPress={handleLogin}
              accessibilityLabel="Sign in"
              accessibilityRole="button"
            >
              {isLoading ? <Spinner color="white" /> : 'Sign In'}
            </Button>
          </YStack>

          {/* Divider */}
          <XStack
            alignItems="center"
            gap={spacing['4']}
            marginVertical={spacing['8']}
          >
            <YStack flex={1} height={1} backgroundColor="$borderColor" />
            <Text color="$colorPress" fontSize={14}>
              or continue with
            </Text>
            <YStack flex={1} height={1} backgroundColor="$borderColor" />
          </XStack>

          {/* Social Login */}
          <XStack gap={spacing['3']} justifyContent="center">
            <SocialButton icon="🍎" label="Apple" />
            <SocialButton icon="🔵" label="Google" />
          </XStack>
        </MotiView>

        {/* Sign Up Link */}
        <XStack justifyContent="center" paddingTop={spacing['4']}>
          <Text color="$colorPress" fontSize={14}>
            Don't have an account?{' '}
          </Text>
          <Button
            backgroundColor="transparent"
            color={colors.primary}
            fontSize={14}
            fontWeight="600"
            paddingHorizontal={0}
            onPress={() => router.push('/(auth)/signup')}
            accessibilityLabel="Create an account"
          >
            Sign up
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  return (
    <Button
      size="$5"
      flex={1}
      backgroundColor="$backgroundHover"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={12}
      pressStyle={{ scale: 0.98 }}
      accessibilityLabel={`Sign in with ${label}`}
    >
      <Text fontSize={20}>{icon}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
