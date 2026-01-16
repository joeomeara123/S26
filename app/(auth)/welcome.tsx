import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, MotiText } from 'moti';
import { YStack, XStack, Text, Button } from 'tamagui';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

/**
 * Welcome Screen
 * First screen users see - introduces Supernova with branding
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/login');
  }, [router]);

  const handleSignup = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/signup');
  }, [router]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <YStack
        flex={1}
        paddingTop={insets.top + spacing['8']}
        paddingBottom={insets.bottom + spacing['4']}
        paddingHorizontal={spacing['6']}
        justifyContent="space-between"
      >
        {/* Logo and Tagline */}
        <YStack alignItems="center" paddingTop={spacing['16']}>
          {/* Animated Logo */}
          <MotiView
            from={{ opacity: 0, scale: 0.5, rotate: '-10deg' }}
            animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 100,
              delay: 200,
            }}
          >
            <YStack
              width={120}
              height={120}
              borderRadius={30}
              backgroundColor="rgba(255,255,255,0.2)"
              alignItems="center"
              justifyContent="center"
              marginBottom={spacing['6']}
            >
              {/* Star icon placeholder */}
              <Text fontSize={60}>✦</Text>
            </YStack>
          </MotiView>

          {/* App Name */}
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 400 }}
            style={styles.title}
          >
            Supernova
          </MotiText>

          {/* Tagline */}
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 600 }}
            style={styles.tagline}
          >
            Social Media For Good
          </MotiText>
        </YStack>

        {/* Features List */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 800 }}
        >
          <YStack gap={spacing['4']} paddingVertical={spacing['8']}>
            <FeatureItem
              icon="🎬"
              text="Discover amazing video content"
              delay={900}
            />
            <FeatureItem
              icon="✨"
              text="Give Supernovas to creators you love"
              delay={1000}
            />
            <FeatureItem
              icon="💚"
              text="Support causes that matter to you"
              delay={1100}
            />
          </YStack>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, delay: 1200 }}
        >
          <YStack gap={spacing['3']}>
            {/* Sign Up Button */}
            <Button
              size="$5"
              backgroundColor="white"
              color={colors.primary}
              fontWeight="600"
              borderRadius={16}
              pressStyle={{ scale: 0.98, opacity: 0.9 }}
              onPress={handleSignup}
              accessibilityLabel="Create account"
              accessibilityRole="button"
            >
              Get Started
            </Button>

            {/* Login Button */}
            <Button
              size="$5"
              backgroundColor="transparent"
              borderWidth={2}
              borderColor="rgba(255,255,255,0.5)"
              color="white"
              fontWeight="600"
              borderRadius={16}
              pressStyle={{ scale: 0.98, opacity: 0.9 }}
              onPress={handleLogin}
              accessibilityLabel="Log in to existing account"
              accessibilityRole="button"
            >
              I already have an account
            </Button>
          </YStack>

          {/* Terms */}
          <Text
            color="rgba(255,255,255,0.6)"
            fontSize={12}
            textAlign="center"
            marginTop={spacing['4']}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </MotiView>
      </YStack>
    </LinearGradient>
  );
}

// Feature list item component
function FeatureItem({
  icon,
  text,
  delay,
}: {
  icon: string;
  text: string;
  delay: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
    >
      <XStack alignItems="center" gap={spacing['3']}>
        <Text fontSize={24}>{icon}</Text>
        <Text color="white" fontSize={16} fontWeight="500">
          {text}
        </Text>
      </XStack>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});
