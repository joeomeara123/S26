import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text } from 'tamagui';
import * as Haptics from 'expo-haptics';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

import { spacing } from '../../constants/spacing';

/**
 * Welcome Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Real brand logos (Google, Apple)
 * - White buttons with colored borders
 * - Clear hierarchy, restrained motion
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20 }]}>

        {/* Logo & Branding */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.brandingSection}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>✦</Text>
          </View>
          <Text style={styles.appName}>Supernova</Text>
          <Text style={styles.tagline}>Social media for good</Text>
        </MotiView>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Auth Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.authSection}
        >
          {/* Google Sign In */}
          <Pressable
            onPress={handleGoogle}
            style={({ pressed }) => [
              styles.authButton,
              styles.authButtonOutline,
              pressed && styles.authButtonPressed,
            ]}
            accessibilityLabel="Continue with Google"
            accessibilityRole="button"
          >
            <GoogleLogo />
            <Text style={styles.authButtonText}>Continue with Google</Text>
          </Pressable>

          {/* Apple Sign In */}
          <Pressable
            onPress={handleApple}
            style={({ pressed }) => [
              styles.authButton,
              styles.authButtonOutline,
              pressed && styles.authButtonPressed,
            ]}
            accessibilityLabel="Continue with Apple"
            accessibilityRole="button"
          >
            <AppleLogo />
            <Text style={styles.authButtonText}>Continue with Apple</Text>
          </Pressable>

          {/* Phone Sign In */}
          <Pressable
            onPress={handlePhone}
            style={({ pressed }) => [
              styles.authButton,
              styles.authButtonOutline,
              pressed && styles.authButtonPressed,
            ]}
            accessibilityLabel="Continue with phone"
            accessibilityRole="button"
          >
            <PhoneIcon />
            <Text style={styles.authButtonText}>Continue with phone</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && { opacity: 0.7 },
            ]}
            accessibilityLabel="Log in to existing account"
            accessibilityRole="button"
          >
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Log in</Text></Text>
          </Pressable>
        </MotiView>

        {/* Terms */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
        >
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </MotiView>
      </View>
    </View>
  );
}

// Google "G" Logo
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

// Apple Logo
function AppleLogo() {
  return (
    <Svg width={18} height={20} viewBox="0 0 17 20" fill="none">
      <Path
        d="M8.35 4.89c.9 0 2.03-.61 2.7-1.42.6-.73 1.04-1.74 1.04-2.76 0-.14-.01-.28-.04-.39-.99.04-2.18.66-2.9 1.5-.56.65-1.08 1.64-1.08 2.67 0 .15.02.3.04.35.07.01.18.05.24.05zM5.53 19.8c1.23 0 1.77-.82 3.31-.82 1.56 0 1.91.8 3.28.8 1.34 0 2.24-1.24 3.08-2.45.95-1.38 1.34-2.74 1.36-2.81-.08-.03-2.66-1.07-2.66-4 0-2.53 2-3.67 2.12-3.76-1.32-1.89-3.33-1.93-3.88-1.93-1.49 0-2.7.9-3.46.9-.81 0-1.92-.85-3.2-.85C3.11 4.88.84 7 .84 11.15c0 2.58.99 5.3 2.21 7.07 1.04 1.5 1.94 2.58 3.24 2.58h.24z"
        fill="#000"
      />
    </Svg>
  );
}

// Phone Icon (simple)
function PhoneIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
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
    paddingHorizontal: spacing['6'],
  },
  brandingSection: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  logoIcon: {
    fontSize: 28,
    color: 'white',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
    marginBottom: spacing['1'],
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  spacer: {
    flex: 1,
  },
  authSection: {
    gap: spacing['3'],
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    gap: spacing['3'],
  },
  authButtonOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  authButtonPressed: {
    backgroundColor: '#F9FAFB',
    transform: [{ scale: 0.99 }],
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['4'],
    marginVertical: spacing['2'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: spacing['3'],
  },
  loginText: {
    fontSize: 15,
    color: '#6B7280',
  },
  loginTextBold: {
    fontWeight: '600',
    color: '#1F2937',
  },
  terms: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing['4'],
  },
  termsLink: {
    color: '#6B7280',
    fontWeight: '500',
  },
});
