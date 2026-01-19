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
import { ChevronLeft, Eye, EyeOff, Check } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../store/authStore';
import { spacing } from '../../constants/spacing';

type SignupStep = 'email' | 'password' | 'name';

/**
 * Signup Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean progress indicator
 * - White inputs with thin borders
 * - Solid dark button
 */
export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signup, isLoading } = useAuthStore();

  const [step, setStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const passwordRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

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

  const steps: SignupStep[] = ['email', 'password', 'name'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleNext = useCallback(async () => {
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === 'email') {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      setStep('password');
      setTimeout(() => passwordRef.current?.focus(), 100);
    } else if (step === 'password') {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      setStep('name');
      setTimeout(() => nameRef.current?.focus(), 100);
    } else if (step === 'name') {
      if (name.trim().length < 2) {
        setError('Please enter your name');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      try {
        await signup(email, password, name);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/(auth)/otp');
      } catch (e) {
        setError('Something went wrong. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [step, email, password, name, signup, router]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'email') {
      router.back();
    } else if (step === 'password') {
      setStep('email');
    } else if (step === 'name') {
      setStep('password');
    }
  }, [step, router]);

  const getStepContent = () => {
    switch (step) {
      case 'email':
        return {
          title: "What's your email?",
          subtitle: "We'll send you a verification code",
          placeholder: 'your@email.com',
          value: email,
          onChange: setEmail,
          keyboardType: 'email-address' as const,
          autoComplete: 'email' as const,
        };
      case 'password':
        return {
          title: 'Create a password',
          subtitle: 'Must be at least 8 characters',
          placeholder: 'Enter a strong password',
          value: password,
          onChange: setPassword,
          secureTextEntry: !showPassword,
        };
      case 'name':
        return {
          title: "What's your name?",
          subtitle: "This is how you'll appear to others",
          placeholder: 'Your name',
          value: name,
          onChange: setName,
          autoComplete: 'name' as const,
        };
    }
  };

  const content = getStepContent();
  const isStepValid = step === 'email' ? email.length > 0 :
                      step === 'password' ? password.length > 0 :
                      name.length > 0;

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

          {/* Clean Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <MotiView
                animate={{ width: `${progress}%` }}
                transition={{ type: 'timing', duration: 300 }}
                style={styles.progressFill}
              />
            </View>
          </View>

          <Text style={styles.stepIndicator}>
            {currentStepIndex + 1}/{steps.length}
          </Text>
        </View>

        {/* Content */}
        <MotiView
          key={step}
          from={{ opacity: 0, translateX: 30 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -30 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.formContent}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.subtitle}>{content.subtitle}</Text>
          </View>

          {/* Clean Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              ref={step === 'password' ? passwordRef : step === 'name' ? nameRef : undefined}
              style={styles.input}
              placeholder={content.placeholder}
              placeholderTextColor="#9CA3AF"
              value={content.value}
              onChangeText={content.onChange}
              keyboardType={content.keyboardType}
              autoComplete={content.autoComplete}
              secureTextEntry={content.secureTextEntry}
              autoCapitalize={step === 'email' || step === 'password' ? 'none' : 'words'}
              autoFocus
              onSubmitEditing={handleNext}
              accessibilityLabel={content.title}
            />
            {step === 'password' && (
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </Pressable>
            )}
          </View>

          {/* Password Requirements */}
          {step === 'password' && (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 200 }}
              style={styles.requirementContainer}
            >
              <View
                style={[
                  styles.checkCircle,
                  password.length >= 8 && styles.checkCircleActive,
                ]}
              >
                {password.length >= 8 && <Check size={12} color="white" />}
              </View>
              <Text
                style={[
                  styles.requirementText,
                  password.length >= 8 && styles.requirementTextActive,
                ]}
              >
                At least 8 characters
              </Text>
            </MotiView>
          )}

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
        </MotiView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing['4'] }]}>
          {/* Continue Button */}
          <Pressable
            onPress={handleNext}
            disabled={isLoading || !isStepValid}
            style={({ pressed }) => [
              styles.continueButton,
              (!isStepValid || isLoading) && styles.continueButtonDisabled,
              pressed && isStepValid && !isLoading && styles.continueButtonPressed,
            ]}
            accessibilityLabel={step === 'name' ? 'Create account' : 'Continue'}
            accessibilityRole="button"
          >
            {isLoading ? (
              <Spinner color="white" />
            ) : (
              <Text style={[
                styles.continueButtonText,
                !isStepValid && styles.continueButtonTextDisabled,
              ]}>
                {step === 'name' ? 'Create Account' : 'Continue'}
              </Text>
            )}
          </Pressable>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
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
    gap: spacing['3'],
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
  progressContainer: {
    flex: 1,
    paddingHorizontal: spacing['2'],
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#1F2937',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    minWidth: 32,
    textAlign: 'right',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: spacing['6'],
  },
  titleSection: {
    marginTop: spacing['6'],
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
  eyeButton: {
    padding: spacing['2'],
    marginLeft: spacing['2'],
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['3'],
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#22C55E',
  },
  requirementText: {
    fontSize: 14,
    color: '#6B7280',
  },
  requirementTextActive: {
    color: '#22C55E',
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: spacing['4'],
    padding: spacing['3'],
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: spacing['6'],
  },
  continueButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#374151',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing['5'],
  },
  loginLinkText: {
    fontSize: 15,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
});
