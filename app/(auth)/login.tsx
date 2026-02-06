import { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Spinner } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Eye, EyeOff } from '@tamagui/lucide-icons';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { AnimatedGradient } from '../../components/ui/AnimatedGradient';
import { GrainOverlay } from '../../components/ui/GrainOverlay';
import { GlassCard } from '../../components/ui/GlassCard';

const SPRING_CONFIG = { stiffness: 120, damping: 14 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(12);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);
  const socialOpacity = useSharedValue(0);
  const signInScale = useSharedValue(1);
  const errorOpacity = useSharedValue(0);
  const errorScale = useSharedValue(0.95);

  useEffect(() => {
    titleOpacity.value = withDelay(100, withSpring(1, SPRING_CONFIG));
    titleTranslateY.value = withDelay(100, withSpring(0, SPRING_CONFIG));
    cardOpacity.value = withDelay(200, withSpring(1, SPRING_CONFIG));
    cardTranslateY.value = withDelay(200, withSpring(0, SPRING_CONFIG));
    socialOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
  }, []);

  useEffect(() => {
    if (error) {
      errorOpacity.value = withSpring(1, SPRING_CONFIG);
      errorScale.value = withSpring(1, SPRING_CONFIG);
    } else {
      errorOpacity.value = 0;
      errorScale.value = 0.95;
    }
  }, [error]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const socialStyle = useAnimatedStyle(() => ({
    opacity: socialOpacity.value,
  }));

  const signInButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signInScale.value }],
  }));

  const errorStyle = useAnimatedStyle(() => ({
    opacity: errorOpacity.value,
    transform: [{ scale: errorScale.value }],
  }));

  const handleLogin = useCallback(async () => {
    setError('');
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

  const handleSignInPressIn = useCallback(() => {
    signInScale.value = withSpring(0.98, SPRING_CONFIG);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleSignInPressOut = useCallback(() => {
    signInScale.value = withSpring(1, SPRING_CONFIG);
  }, []);

  const isValid = email.length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={StyleSheet.absoluteFill}>
        <AnimatedGradient />
      </View>
      <GrainOverlay />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={[styles.content, { paddingTop: insets.top + spacing['2'] }]}>
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
              <ChevronLeft size={24} color="#FAFAFA" />
            </Pressable>
          </View>

          <Animated.View style={[styles.titleSection, titleStyle]}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </Animated.View>

          <Animated.View style={cardStyle}>
            <GlassCard style={styles.glassCard}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      emailFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor={colors.auth.textTertiary}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      accessibilityLabel="Email address"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      passwordFocused && styles.inputWrapperFocused,
                    ]}
                  >
                    <TextInput
                      ref={passwordRef}
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.auth.textTertiary}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      accessibilityLabel="Password"
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={colors.auth.textSecondary} />
                      ) : (
                        <Eye size={20} color={colors.auth.textSecondary} />
                      )}
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={() => router.push('/(auth)/forgot-password')}
                  style={styles.forgotButton}
                  accessibilityLabel="Forgot password"
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>

                {error ? (
                  <Animated.View style={[styles.errorContainer, errorStyle]}>
                    <Text style={styles.errorText}>{error}</Text>
                  </Animated.View>
                ) : null}

                <AnimatedPressable
                  onPress={handleLogin}
                  onPressIn={isValid && !isLoading ? handleSignInPressIn : undefined}
                  onPressOut={isValid && !isLoading ? handleSignInPressOut : undefined}
                  disabled={isLoading || !isValid}
                  style={[
                    styles.loginButton,
                    (!isValid || isLoading) && styles.loginButtonDisabled,
                    signInButtonStyle,
                  ]}
                  accessibilityLabel="Sign in"
                  accessibilityRole="button"
                >
                  {isLoading ? (
                    <Spinner color={colors.auth.background} />
                  ) : (
                    <Text
                      style={[
                        styles.loginButtonText,
                        (!isValid || isLoading) && styles.loginButtonTextDisabled,
                      ]}
                    >
                      Sign In
                    </Text>
                  )}
                </AnimatedPressable>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View style={socialStyle}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
                accessibilityLabel="Sign in with Google"
                accessibilityRole="button"
              >
                <GoogleLogo />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
                accessibilityLabel="Sign in with Apple"
                accessibilityRole="button"
              >
                <AppleLogo />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>

        <View style={[styles.signupContainer, { paddingBottom: insets.bottom + spacing['4'] }]}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function GoogleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={16} height={18} viewBox="0 0 17 20" fill="none">
      <Path
        d="M8.35 4.89c.9 0 2.03-.61 2.7-1.42.6-.73 1.04-1.74 1.04-2.76 0-.14-.01-.28-.04-.39-.99.04-2.18.66-2.9 1.5-.56.65-1.08 1.64-1.08 2.67 0 .15.02.3.04.35.07.01.18.05.24.05zM5.53 19.8c1.23 0 1.77-.82 3.31-.82 1.56 0 1.91.8 3.28.8 1.34 0 2.24-1.24 3.08-2.45.95-1.38 1.34-2.74 1.36-2.81-.08-.03-2.66-1.07-2.66-4 0-2.53 2-3.67 2.12-3.76-1.32-1.89-3.33-1.93-3.88-1.93-1.49 0-2.7.9-3.46.9-.81 0-1.92-.85-3.2-.85C3.11 4.88.84 7 .84 11.15c0 2.58.99 5.3 2.21 7.07 1.04 1.5 1.94 2.58 3.24 2.58h.24z"
        fill="#FAFAFA"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.auth.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  titleSection: {
    marginTop: spacing['4'],
    marginBottom: spacing['6'],
    paddingHorizontal: spacing['6'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.auth.textPrimary,
    marginBottom: spacing['1'],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.auth.textSecondary,
  },
  glassCard: {
    marginHorizontal: spacing['5'],
  },
  form: {
    gap: spacing['4'],
  },
  inputContainer: {
    gap: spacing['2'],
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.auth.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.auth.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.auth.inputBorder,
    paddingHorizontal: spacing['4'],
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.auth.textPrimary,
    height: '100%',
  },
  eyeButton: {
    padding: spacing['2'],
    marginLeft: spacing['2'],
  },
  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing['1'],
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.auth.textSecondary,
  },
  errorContainer: {
    padding: spacing['3'],
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2'],
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing['6'],
    paddingHorizontal: spacing['6'],
    gap: spacing['4'],
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    fontSize: 14,
    color: colors.auth.textTertiary,
  },
  socialContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing['5'],
    gap: spacing['3'],
  },
  socialButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.auth.glassBackground,
    borderWidth: 1,
    borderColor: colors.auth.glassBorder,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  socialButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.auth.textPrimary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['6'],
  },
  signupText: {
    fontSize: 15,
    color: colors.auth.textSecondary,
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.auth.textPrimary,
  },
});
