import { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';

/**
 * Phone Number Auth Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel (matching welcome screen)
 * - Subtle animated gradient background
 * - Large, auto-formatting phone display
 * - Simple, elegant experience
 * - Solid primary button (not gradient)
 */
export default function PhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loginWithPhone } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('+1');
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<TextInput>(null);

  // Animated gradient rotation (matching welcome screen)
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

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Format phone number as user types: (650) 213-7379
  const formatPhoneNumber = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);

    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(digits);

    // Haptic feedback on each digit
    if (digits.length > phoneNumber.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleContinue = useCallback(async () => {
    if (phoneNumber.length < 10) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Mock login - in real app, this would send SMS
    try {
      await loginWithPhone(`${countryCode}${phoneNumber}`);
      router.push('/(auth)/otp');
    } catch (e) {
      // Handle error
    }
  }, [phoneNumber, countryCode, loginWithPhone, router]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const isValid = phoneNumber.length === 10;
  const displayNumber = formatPhoneNumber(phoneNumber);

  return (
    <View style={styles.container}>
      {/* Subtle animated gradient background (matching welcome screen) */}
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

      {/* Header with back button */}
      <View style={[styles.header, { paddingTop: insets.top + spacing['2'] }]}>
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

      {/* Main content - centered vertically */}
      <Pressable
        style={styles.content}
        onPress={() => inputRef.current?.focus()}
      >
        {/* Question */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
        >
          <Text style={styles.question}>What's your{'\n'}phone number?</Text>
        </MotiView>

        {/* Phone Number Display */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 200 }}
          style={styles.phoneContainer}
        >
          {/* Country Code */}
          <Pressable style={styles.countrySelector}>
            <Text style={styles.flag}>🇺🇸</Text>
            <Text style={styles.countryCode}>{countryCode}</Text>
          </Pressable>

          {/* Formatted Number */}
          <View style={styles.numberDisplay}>
            {displayNumber ? (
              <Text style={styles.phoneNumber}>{displayNumber}</Text>
            ) : (
              <Text style={styles.placeholder}>(000) 000-0000</Text>
            )}

            {/* Cursor */}
            {isFocused && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: 'timing',
                  duration: 500,
                  loop: true,
                }}
                style={styles.cursor}
              />
            )}
          </View>

          {/* Hidden Input */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
          />
        </MotiView>

        {/* Subtle helper text */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
        >
          <Text style={styles.helper}>We'll send you a code to verify</Text>
        </MotiView>
      </Pressable>

      {/* Continue Button - Fixed at bottom */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, delay: 300 }}
        style={[styles.buttonContainer, { paddingBottom: insets.bottom + spacing['6'] }]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!isValid}
          style={({ pressed }) => [
            styles.continueButton,
            !isValid && styles.continueButtonDisabled,
            pressed && isValid && styles.continueButtonPressed,
          ]}
          accessibilityLabel="Continue"
          accessibilityRole="button"
        >
          <Text style={[
            styles.continueText,
            !isValid && styles.continueTextDisabled
          ]}>
            Continue
          </Text>
        </Pressable>
      </MotiView>
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
  header: {
    paddingHorizontal: spacing['5'],
    paddingBottom: spacing['2'],
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['6'],
    paddingBottom: 120,
  },
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: spacing['10'],
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['6'],
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing['2'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['3'],
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flag: {
    fontSize: 20,
    marginRight: spacing['1'],
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  numberDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  placeholder: {
    fontSize: 28,
    fontWeight: '600',
    color: '#D1D5DB',
    letterSpacing: 0.5,
  },
  cursor: {
    width: 2,
    height: 32,
    backgroundColor: '#1F2937',
    marginLeft: 2,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  helper: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
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
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  continueTextDisabled: {
    color: '#9CA3AF',
  },
});
