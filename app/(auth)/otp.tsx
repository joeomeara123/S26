import { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Keyboard,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text, Spinner } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../store/authStore';
import { spacing } from '../../constants/spacing';

const OTP_LENGTH = 6;

/**
 * OTP Verification Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean OTP boxes with thin borders
 * - Solid dark verify button
 */
export default function OTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { verifyOTP, isLoading, user, pendingPhone } = useAuthStore();

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animated gradient rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
          router.replace('/(onboarding)');
        } else {
          setError('Invalid code. Please try again.');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      const digit = value.replace(/[^0-9]/g, '');

      if (digit.length <= 1) {
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        if (digit && index < OTP_LENGTH - 1) {
          inputRefs.current[index + 1]?.focus();
          setFocusedIndex(index + 1);
        }
      } else if (digit.length === OTP_LENGTH) {
        const digits = digit.split('');
        setCode(digits);
        inputRefs.current[OTP_LENGTH - 1]?.focus();
        setFocusedIndex(OTP_LENGTH - 1);
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [code]
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
    },
    [code]
  );

  const handleResend = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setResendTimer(30);
    setError('');
  }, []);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const isComplete = !code.includes('');

  // Display phone or email
  const displayContact = pendingPhone
    ? `(***) ***-${pendingPhone.slice(-4)}`
    : user?.email || 'your email';

  return (
    <View style={styles.container}>
      {/* Subtle animated gradient background */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.gradientOrb,
            { transform: [{ rotate: rotation }] }
          ]}
        >
          <LinearGradient
            colors={['#E0F2FE', '#FEF3C7', '#FCE7F3', '#E0E7FF']}
            style={styles.orbGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      </View>

      {/* Base background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FAFAFA' }]} />

      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(250,250,250,0)', 'rgba(250,250,250,0.8)', 'rgba(250,250,250,1)']}
        locations={[0, 0.5, 0.8]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + spacing['2'] }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ChevronLeft size={24} color="#1F2937" />
          </Pressable>
        </View>

        {/* Content */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.formContent}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Enter code</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{' '}
              <Text style={styles.contactHighlight}>{displayContact}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <MotiView
                key={index}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: index * 50 }}
              >
                <View
                  style={[
                    styles.otpBox,
                    digit && styles.otpBoxFilled,
                    focusedIndex === index && styles.otpBoxFocused,
                    error && !digit && styles.otpBoxError,
                  ]}
                >
                  <TextInput
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleChange(index, value)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(index, nativeEvent.key)
                    }
                    onFocus={() => setFocusedIndex(index)}
                    keyboardType="number-pad"
                    maxLength={index === 0 ? OTP_LENGTH : 1}
                    selectTextOnFocus
                    accessibilityLabel={`Digit ${index + 1}`}
                  />
                </View>
              </MotiView>
            ))}
          </View>

          {/* Error Message */}
          {error && (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.errorContainer}
            >
              <Text style={styles.errorText}>{error}</Text>
            </MotiView>
          )}

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendLabel}>Didn't receive the code? </Text>
            {resendTimer > 0 ? (
              <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendButton}>Resend</Text>
              </Pressable>
            )}
          </View>
        </MotiView>

        {/* Verify Button */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing['6'] }]}>
          <Pressable
            onPress={() => handleVerify(code.join(''))}
            disabled={isLoading || !isComplete}
            style={({ pressed }) => [
              styles.verifyButton,
              (!isComplete || isLoading) && styles.verifyButtonDisabled,
              pressed && isComplete && !isLoading && styles.verifyButtonPressed,
            ]}
            accessibilityLabel="Verify code"
            accessibilityRole="button"
          >
            {isLoading ? (
              <Spinner color="white" />
            ) : (
              <Text style={[
                styles.verifyButtonText,
                !isComplete && styles.verifyButtonTextDisabled,
              ]}>
                Verify
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOrb: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 600,
    height: 600,
    opacity: 0.5,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 300,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['2'],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#F9FAFB',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: spacing['6'],
  },
  titleSection: {
    marginTop: spacing['4'],
    marginBottom: spacing['8'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: spacing['2'],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  contactHighlight: {
    fontWeight: '600',
    color: '#1F2937',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing['2'],
    marginBottom: spacing['6'],
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  otpBoxFocused: {
    borderColor: '#1F2937',
    borderWidth: 2,
  },
  otpBoxError: {
    borderColor: '#DC2626',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    color: '#1F2937',
  },
  errorContainer: {
    padding: spacing['3'],
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: spacing['4'],
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  resendTimer: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  resendButton: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  bottomSection: {
    paddingHorizontal: spacing['6'],
  },
  verifyButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  verifyButtonPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#374151',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
