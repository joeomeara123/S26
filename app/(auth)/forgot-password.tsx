import { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
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
import { ChevronLeft, Check, ArrowLeft } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '../../constants/spacing';

/**
 * Forgot Password Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - White inputs with thin borders
 * - Solid dark button
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

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

  const isValid = email.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          {isSent ? (
            // Success State
            <View style={styles.successContainer}>
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <View style={styles.successIcon}>
                  <Check size={32} color="white" strokeWidth={3} />
                </View>
              </MotiView>

              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successSubtitle}>
                We sent a password reset link to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              <Pressable
                onPress={() => router.replace('/(auth)/login')}
                style={({ pressed }) => [
                  styles.backToLoginButton,
                  pressed && styles.buttonPressed,
                ]}
                accessibilityLabel="Back to login"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Back to Login</Text>
              </Pressable>
            </View>
          ) : (
            // Input State
            <>
              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>Forgot password?</Text>
                <Text style={styles.subtitle}>
                  No worries, we'll send you reset instructions.
                </Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="done"
                    onSubmitEditing={handleSendReset}
                    accessibilityLabel="Email address"
                  />
                </View>
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

              {/* Reset Button */}
              <Pressable
                onPress={handleSendReset}
                disabled={isLoading || !isValid}
                style={({ pressed }) => [
                  styles.resetButton,
                  (!isValid || isLoading) && styles.resetButtonDisabled,
                  pressed && isValid && !isLoading && styles.resetButtonPressed,
                ]}
                accessibilityLabel="Reset password"
                accessibilityRole="button"
              >
                {isLoading ? (
                  <Spinner color="white" />
                ) : (
                  <Text style={[
                    styles.buttonText,
                    !isValid && styles.buttonTextDisabled,
                  ]}>
                    Reset Password
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </MotiView>

        {/* Back to Login Link */}
        {!isSent && (
          <View style={[styles.bottomLink, { paddingBottom: insets.bottom + spacing['4'] }]}>
            <Pressable
              onPress={handleBack}
              style={styles.backLinkButton}
              accessibilityLabel="Back to login"
            >
              <ArrowLeft size={16} color="#6B7280" />
              <Text style={styles.backLinkText}>Back to login</Text>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: spacing['1'],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  inputContainer: {
    gap: spacing['2'],
    marginBottom: spacing['4'],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: spacing['4'],
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
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
  resetButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2'],
  },
  resetButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  resetButtonPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#374151',
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#374151',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
  bottomLink: {
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
  },
  backLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['2'],
  },
  backLinkText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Success State
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing['16'],
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['6'],
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: spacing['2'],
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#1F2937',
  },
  backToLoginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['10'],
    width: '100%',
  },
});
