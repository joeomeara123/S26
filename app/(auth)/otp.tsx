import { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Spinner } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft } from '@tamagui/lucide-icons';

import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

const OTP_LENGTH = 6;

/**
 * OTP Verification Screen
 * 6-digit code input with auto-focus and countdown timer
 */
export default function OTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { verifyOTP, isLoading, user } = useAuthStore();

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-submit when all digits entered
  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === OTP_LENGTH && !code.includes('')) {
      handleVerify(fullCode);
    }
  }, [code]);

  const handleVerify = useCallback(
    async (fullCode: string) => {
      setError('');
      Keyboard.dismiss();

      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const isValid = await verifyOTP(fullCode);

        if (isValid) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Navigate to onboarding for new users
          router.replace('/(onboarding)');
        } else {
          setError('Invalid code. Please try again.');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          // Clear the code
          setCode(Array(OTP_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
        }
      } catch (e) {
        setError('Something went wrong. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
    [verifyOTP, router]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      const digit = value.replace(/[^0-9]/g, '');

      if (digit.length <= 1) {
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        // Auto-focus next input
        if (digit && index < OTP_LENGTH - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      } else if (digit.length === OTP_LENGTH) {
        // Handle paste of full code
        const digits = digit.split('');
        setCode(digits);
        inputRefs.current[OTP_LENGTH - 1]?.focus();
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [code]
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handleResend = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setResendTimer(30);
    setError('');
    // In a real app, this would trigger a new OTP
    // For demo, just reset timer
  }, []);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  return (
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
        <YStack gap={spacing['2']} marginTop={spacing['8']}>
          <Text fontSize={28} fontWeight="700" color="$color">
            Verify your email
          </Text>
          <Text fontSize={16} color="$colorPress">
            We sent a code to{' '}
            <Text fontWeight="600" color="$color">
              {user?.email || 'your email'}
            </Text>
          </Text>
        </YStack>

        {/* OTP Input */}
        <XStack
          justifyContent="space-between"
          gap={spacing['2']}
          marginTop={spacing['10']}
          marginBottom={spacing['6']}
        >
          {code.map((digit, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: index * 50 }}
            >
              <YStack
                width={52}
                height={64}
                borderRadius={12}
                borderWidth={2}
                borderColor={
                  digit
                    ? colors.primary
                    : error
                    ? colors.semantic.error
                    : '$borderColor'
                }
                backgroundColor={digit ? colors.primaryMuted : '$backgroundHover'}
                alignItems="center"
                justifyContent="center"
              >
                <TextInput
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleChange(index, value)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(index, nativeEvent.key)
                  }
                  keyboardType="number-pad"
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  selectTextOnFocus
                  accessibilityLabel={`Digit ${index + 1}`}
                />
              </YStack>
            </MotiView>
          ))}
        </XStack>

        {/* Error Message */}
        {error && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Text
              color={colors.semantic.error}
              fontSize={14}
              textAlign="center"
              marginBottom={spacing['4']}
            >
              {error}
            </Text>
          </MotiView>
        )}

        {/* Resend Code */}
        <XStack justifyContent="center" alignItems="center" gap={spacing['1']}>
          <Text color="$colorPress" fontSize={14}>
            Didn't receive the code?
          </Text>
          {resendTimer > 0 ? (
            <Text color="$colorPress" fontSize={14}>
              Resend in {resendTimer}s
            </Text>
          ) : (
            <Button
              backgroundColor="transparent"
              color={colors.primary}
              fontSize={14}
              fontWeight="600"
              paddingHorizontal={spacing['1']}
              onPress={handleResend}
              accessibilityLabel="Resend verification code"
            >
              Resend
            </Button>
          )}
        </XStack>
      </MotiView>

      {/* Verify Button */}
      <Button
        size="$5"
        backgroundColor={colors.primary}
        color="white"
        fontWeight="600"
        borderRadius={16}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        disabled={isLoading || code.includes('')}
        opacity={code.includes('') ? 0.6 : 1}
        onPress={() => handleVerify(code.join(''))}
        accessibilityLabel="Verify code"
        accessibilityRole="button"
      >
        {isLoading ? <Spinner color="white" /> : 'Verify'}
      </Button>
    </YStack>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    color: '#111827',
  },
});
