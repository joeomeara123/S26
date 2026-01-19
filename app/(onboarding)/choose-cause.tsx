import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from '../../components/MotiWrapper';
import { Text } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { CauseCode } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { causes, Cause } from '../../data/causes';

/**
 * Choose Your Cause Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean cause cards with borders
 * - Solid dark button
 */
export default function ChooseCauseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useAuthStore();

  const [selectedCause, setSelectedCause] = useState<CauseCode | null>(null);

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

  const handleSelect = useCallback((code: CauseCode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCause(code);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedCause) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      updateUser({ cause: selectedCause });
      router.push('/(onboarding)/follow-people');
    }
  }, [selectedCause, updateUser, router]);

  const causeList = Object.values(causes);

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

      <View style={[styles.content, { paddingTop: insets.top + spacing['4'] }]}>
        {/* Header */}
        <View style={styles.header}>
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Text style={styles.title}>Choose Your Cause</Text>
            <Text style={styles.subtitle}>
              Your engagement will support this charity. You can change this anytime.
            </Text>
          </MotiView>
        </View>

        {/* Causes List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.causesGrid}>
            {causeList.map((cause, index) => (
              <MotiView
                key={cause.code}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: index * 60 }}
              >
                <CauseCard
                  cause={cause}
                  isSelected={selectedCause === cause.code}
                  onSelect={() => handleSelect(cause.code)}
                />
              </MotiView>
            ))}
          </View>
        </ScrollView>

        {/* Continue Button - Solid dark */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing['4'] }]}>
          <Pressable
            onPress={handleContinue}
            disabled={!selectedCause}
            style={({ pressed }) => [
              styles.continueButton,
              !selectedCause && styles.continueButtonDisabled,
              pressed && selectedCause && styles.continueButtonPressed,
            ]}
            accessibilityLabel="Continue to next step"
            accessibilityRole="button"
          >
            <Text style={[
              styles.continueButtonText,
              !selectedCause && styles.continueButtonTextDisabled,
            ]}>
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function CauseCard({
  cause,
  isSelected,
  onSelect,
}: {
  cause: Cause;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.causeCard,
        isSelected && styles.causeCardSelected,
        pressed && styles.causeCardPressed,
      ]}
      accessibilityLabel={`Select ${cause.name}`}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={styles.causeCardContent}>
        {/* Icon */}
        <View style={[
          styles.causeIconContainer,
          isSelected && { backgroundColor: '#F3F4F6' }
        ]}>
          <Text style={styles.causeIcon}>{cause.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.causeInfo}>
          <Text style={styles.causeName}>{cause.name}</Text>
          <Text style={styles.causeImpact} numberOfLines={2}>
            {cause.impact}
          </Text>
        </View>

        {/* Selection Indicator - Clean dark circle */}
        <AnimatePresence>
          {isSelected && (
            <MotiView
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <View style={styles.checkCircle}>
                <Check size={16} color="white" strokeWidth={3} />
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Pressable>
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
    paddingHorizontal: spacing['6'],
    marginBottom: spacing['6'],
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
  },
  causesGrid: {
    gap: spacing['3'],
  },
  causeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  causeCardSelected: {
    borderColor: '#1F2937',
    borderWidth: 2,
  },
  causeCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#F9FAFB',
  },
  causeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  causeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  causeIcon: {
    fontSize: 24,
  },
  causeInfo: {
    flex: 1,
    gap: spacing['1'],
  },
  causeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  causeImpact: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['4'],
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
});
