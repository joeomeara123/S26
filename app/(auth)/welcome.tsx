import { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'tamagui';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';

import { AnimatedGradient } from '../../components/ui/AnimatedGradient';
import { GrainOverlay } from '../../components/ui/GrainOverlay';
import { LetterReveal } from '../../components/ui/LetterReveal';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPRING_CONFIG = { stiffness: 120, damping: 14 };
const SMOOTH_SPRING = { stiffness: 80, damping: 18 };

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Phase 1: Splash (cinematic logo reveal)
  const whiteOverlay = useSharedValue(1);       // 1 = white, 0 = transparent
  const logoProgress = useSharedValue(0);        // logo icon appear
  const taglineProgress = useSharedValue(0);     // "Social media for good"

  // Phase 2: Transition (logo moves up, auth slides in)
  const transitionProgress = useSharedValue(0);  // 0 = centered splash, 1 = top position
  const btn0Progress = useSharedValue(0);
  const btn1Progress = useSharedValue(0);
  const btn2Progress = useSharedValue(0);
  const dividerProgress = useSharedValue(0);
  const loginProgress = useSharedValue(0);
  const termsProgress = useSharedValue(0);

  // Calculate how far to move branding up during transition
  // In splash: branding is centered vertically
  // In final: branding is at top with paddingTop
  const brandingTargetY = -(SCREEN_HEIGHT * 0.18);

  useEffect(() => {
    // Phase 1: Splash
    // White overlay fades out revealing the gradient
    whiteOverlay.value = withDelay(
      100,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) }),
    );
    // Logo scales in
    logoProgress.value = withDelay(200, withSpring(1, SPRING_CONFIG));
    // LetterReveal handles its own timing (startDelay=500)
    // Tagline fades in after letters
    taglineProgress.value = withDelay(
      1500,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
    );

    // Phase 2: Transition — logo group scales down + moves up
    transitionProgress.value = withDelay(
      2200,
      withSpring(1, SMOOTH_SPRING),
    );
    // Auth buttons stagger in
    btn0Progress.value = withDelay(2700, withSpring(1, SPRING_CONFIG));
    btn1Progress.value = withDelay(2800, withSpring(1, SPRING_CONFIG));
    btn2Progress.value = withDelay(2900, withSpring(1, SPRING_CONFIG));
    dividerProgress.value = withDelay(
      3000,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
    loginProgress.value = withDelay(
      3000,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
    termsProgress.value = withDelay(
      3100,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
    );

    return () => {
      cancelAnimation(whiteOverlay);
      cancelAnimation(logoProgress);
      cancelAnimation(taglineProgress);
      cancelAnimation(transitionProgress);
      cancelAnimation(btn0Progress);
      cancelAnimation(btn1Progress);
      cancelAnimation(btn2Progress);
      cancelAnimation(dividerProgress);
      cancelAnimation(loginProgress);
      cancelAnimation(termsProgress);
    };
  }, []);

  // White overlay (fades from white to transparent)
  const whiteOverlayStyle = useAnimatedStyle(() => ({
    opacity: whiteOverlay.value,
  }));

  // Branding group: starts centered, moves up + scales down
  const brandingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(transitionProgress.value, [0, 1], [0, brandingTargetY]) },
      { scale: interpolate(transitionProgress.value, [0, 1], [1, 0.85]) },
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoProgress.value,
    transform: [{ scale: interpolate(logoProgress.value, [0, 1], [0.8, 1]) }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineProgress.value,
  }));

  // Auth section slides up from below
  const authSectionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transitionProgress.value, [0, 0.3, 1], [0, 0, 1]),
    transform: [
      { translateY: interpolate(transitionProgress.value, [0, 1], [60, 0]) },
    ],
  }));

  const btn0Style = useAnimatedStyle(() => ({
    opacity: btn0Progress.value,
    transform: [{ translateY: interpolate(btn0Progress.value, [0, 1], [20, 0]) }],
  }));

  const btn1Style = useAnimatedStyle(() => ({
    opacity: btn1Progress.value,
    transform: [{ translateY: interpolate(btn1Progress.value, [0, 1], [20, 0]) }],
  }));

  const btn2Style = useAnimatedStyle(() => ({
    opacity: btn2Progress.value,
    transform: [{ translateY: interpolate(btn2Progress.value, [0, 1], [20, 0]) }],
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    opacity: dividerProgress.value,
  }));

  const loginStyle = useAnimatedStyle(() => ({
    opacity: loginProgress.value,
  }));

  const termsStyle = useAnimatedStyle(() => ({
    opacity: termsProgress.value,
  }));

  const handleGoogle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/signup');
  }, [router]);

  const handleApple = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/signup');
  }, [router]);

  const handlePhone = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // @ts-ignore - route exists
    router.push('/(auth)/phone');
  }, [router]);

  const handleLogin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/login');
  }, [router]);

  return (
    <View style={styles.container}>
      <AnimatedGradient style={{ ...StyleSheet.absoluteFillObject }} />
      <GrainOverlay />

      {/* Content layer */}
      <View style={styles.content}>
        {/* Branding — starts vertically centered, transitions to top */}
        <View style={styles.brandingWrapper}>
          <Animated.View style={[styles.brandingSection, brandingStyle]}>
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <View style={styles.logoGlow} />
              <Text style={styles.logoIcon}>✦</Text>
            </Animated.View>
            <LetterReveal
              text="Supernova"
              style={styles.appName}
              startDelay={500}
              letterDelay={70}
              letterDuration={350}
            />
            <Animated.View style={taglineStyle}>
              <Text style={styles.tagline}>Social media for good</Text>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Auth section — absolutely positioned at bottom so it doesn't shift branding center */}
        <Animated.View style={[styles.authBottom, { paddingBottom: insets.bottom + 20 }, authSectionStyle]}>
          <Animated.View style={btn0Style}>
            <AuthButton
              onPress={handleGoogle}
              label="Continue with Google"
              icon={<GoogleLogo />}
            />
          </Animated.View>

          <Animated.View style={btn1Style}>
            <AuthButton
              onPress={handleApple}
              label="Continue with Apple"
              icon={<AppleLogo />}
            />
          </Animated.View>

          <Animated.View style={btn2Style}>
            <AuthButton
              onPress={handlePhone}
              label="Continue with phone"
              icon={<PhoneIcon />}
            />
          </Animated.View>

          <Animated.View style={dividerStyle}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
          </Animated.View>

          <Animated.View style={loginStyle}>
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [styles.loginButton, pressed && { opacity: 0.7 }]}
              accessibilityLabel="Log in to existing account"
              accessibilityRole="button"
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Log in</Text>
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={termsStyle}>
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* White overlay — starts opaque, fades to reveal gradient */}
      <Animated.View style={[styles.whiteOverlay, whiteOverlayStyle]} pointerEvents="none" />
    </View>
  );
}

function AuthButton({
  onPress,
  label,
  icon,
}: {
  onPress: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, []);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.authButton, animatedStyle]}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {icon}
      <Text style={styles.authButtonText}>{label}</Text>
    </AnimatedPressable>
  );
}

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
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
    <Svg width={18} height={20} viewBox="0 0 17 20" fill="none">
      <Path
        d="M8.35 4.89c.9 0 2.03-.61 2.7-1.42.6-.73 1.04-1.74 1.04-2.76 0-.14-.01-.28-.04-.39-.99.04-2.18.66-2.9 1.5-.56.65-1.08 1.64-1.08 2.67 0 .15.02.3.04.35.07.01.18.05.24.05zM5.53 19.8c1.23 0 1.77-.82 3.31-.82 1.56 0 1.91.8 3.28.8 1.34 0 2.24-1.24 3.08-2.45.95-1.38 1.34-2.74 1.36-2.81-.08-.03-2.66-1.07-2.66-4 0-2.53 2-3.67 2.12-3.76-1.32-1.89-3.33-1.93-3.88-1.93-1.49 0-2.7.9-3.46.9-.81 0-1.92-.85-3.2-.85C3.11 4.88.84 7 .84 11.15c0 2.58.99 5.3 2.21 7.07 1.04 1.5 1.94 2.58 3.24 2.58h.24z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.auth.background,
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  brandingWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingSection: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
    overflow: 'visible',
  },
  logoGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  logoIcon: {
    fontSize: 30,
    color: '#FAFAFA',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.auth.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing['1'],
    textShadowColor: 'rgba(255, 255, 255, 0.15)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  tagline: {
    fontSize: 16,
    color: colors.auth.textSecondary,
    fontWeight: '400',
  },
  authBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing['6'],
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: spacing['3'],
    marginBottom: spacing['3'],
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.auth.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    marginVertical: spacing['1'],
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    fontSize: 14,
    color: colors.auth.textTertiary,
    fontWeight: '400',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: spacing['3'],
  },
  loginText: {
    fontSize: 15,
    color: colors.auth.textSecondary,
  },
  loginTextBold: {
    fontWeight: '600',
    color: colors.auth.textPrimary,
  },
  terms: {
    fontSize: 13,
    color: colors.auth.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing['2'],
  },
  termsLink: {
    color: colors.auth.textSecondary,
    fontWeight: '500',
  },
});
