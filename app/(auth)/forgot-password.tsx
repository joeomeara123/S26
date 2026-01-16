import { useState, useCallback } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Input, Spinner } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Mail, Check } from '@tamagui/lucide-icons';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

/**
 * Forgot Password Screen
 * Email input to send password reset link
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendReset = useCallback(async () => {
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSent(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      setError('Something went wrong. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

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
          {isSent ? (
            // Success State
            <YStack alignItems="center" paddingTop={spacing['16']}>
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <YStack
                  width={80}
                  height={80}
                  borderRadius={40}
                  backgroundColor={colors.semantic.successLight}
                  alignItems="center"
                  justifyContent="center"
                  marginBottom={spacing['6']}
                >
                  <Check size={40} color={colors.semantic.success} />
                </YStack>
              </MotiView>

              <Text fontSize={28} fontWeight="700" color="$color" textAlign="center">
                Check your email
              </Text>
              <Text
                fontSize={16}
                color="$colorPress"
                textAlign="center"
                marginTop={spacing['2']}
              >
                We sent a password reset link to{'\n'}
                <Text fontWeight="600" color="$color">
                  {email}
                </Text>
              </Text>

              <Button
                size="$5"
                backgroundColor={colors.primary}
                color="white"
                fontWeight="600"
                borderRadius={16}
                marginTop={spacing['10']}
                width="100%"
                pressStyle={{ scale: 0.98, opacity: 0.9 }}
                onPress={() => router.replace('/(auth)/login')}
                accessibilityLabel="Back to login"
              >
                Back to Login
              </Button>
            </YStack>
          ) : (
            // Input State
            <>
              <YStack gap={spacing['2']} marginTop={spacing['8']}>
                <Text fontSize={28} fontWeight="700" color="$color">
                  Forgot password?
                </Text>
                <Text fontSize={16} color="$colorPress">
                  No worries, we'll send you reset instructions.
                </Text>
              </YStack>

              {/* Email Input */}
              <YStack gap={spacing['4']} marginTop={spacing['8']}>
                <YStack gap={spacing['2']}>
                  <Text fontSize={14} fontWeight="500" color="$color">
                    Email
                  </Text>
                  <XStack
                    alignItems="center"
                    backgroundColor="$backgroundHover"
                    borderRadius={12}
                    borderWidth={1}
                    borderColor="$borderColor"
                    paddingLeft={spacing['3']}
                  >
                    <Mail size={20} color={colors.light.textSecondary} />
                    <Input
                      flex={1}
                      size="$5"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={email}
                      onChangeText={setEmail}
                      borderWidth={0}
                      backgroundColor="transparent"
                      accessibilityLabel="Email address"
                    />
                  </XStack>
                </YStack>

                {/* Error Message */}
                {error && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Text color={colors.semantic.error} fontSize={14}>
                      {error}
                    </Text>
                  </MotiView>
                )}

                {/* Reset Button */}
                <Button
                  size="$5"
                  backgroundColor={colors.primary}
                  color="white"
                  fontWeight="600"
                  borderRadius={16}
                  marginTop={spacing['4']}
                  pressStyle={{ scale: 0.98, opacity: 0.9 }}
                  disabled={isLoading}
                  onPress={handleSendReset}
                  accessibilityLabel="Reset password"
                  accessibilityRole="button"
                >
                  {isLoading ? <Spinner color="white" /> : 'Reset Password'}
                </Button>
              </YStack>
            </>
          )}
        </MotiView>

        {/* Back to Login */}
        {!isSent && (
          <XStack justifyContent="center" paddingTop={spacing['4']}>
            <Button
              backgroundColor="transparent"
              color="$colorPress"
              fontSize={14}
              onPress={handleBack}
              accessibilityLabel="Back to login"
            >
              ← Back to login
            </Button>
          </XStack>
        )}
      </YStack>
    </KeyboardAvoidingView>
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
