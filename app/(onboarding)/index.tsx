import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  ViewToken,
  StyleSheet,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Sparkles, Heart, Award } from '@tamagui/lucide-icons';

import { spacing } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: <Play size={32} color="#1F2937" strokeWidth={2} />,
    title: 'Discover Amazing Content',
    description: 'Swipe through a feed of inspiring videos and posts from creators who spread positivity.',
  },
  {
    id: '2',
    icon: <Sparkles size={32} color="#1F2937" strokeWidth={2} />,
    title: 'Give Supernovas',
    description: "When you love something, give it a Supernova! It's our special way of showing appreciation.",
  },
  {
    id: '3',
    icon: <Heart size={32} color="#1F2937" strokeWidth={2} />,
    title: 'Support Causes You Care About',
    description: 'Every Supernova contributes to real-world charities. Your engagement makes a difference!',
  },
  {
    id: '4',
    icon: <Award size={32} color="#1F2937" strokeWidth={2} />,
    title: 'Earn Karma',
    description: 'Engage with content to earn karma. Reach 100 karma to unlock the power to give Supernovas!',
  },
];

/**
 * Onboarding Intro Screens - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean icon containers with borders
 * - Solid dark button
 */
export default function OnboardingIntro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.push('/(onboarding)/choose-cause');
    }
  }, [currentIndex, router]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(onboarding)/choose-cause');
  }, [router]);

  const isLastSlide = currentIndex === slides.length - 1;

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
        {/* Skip Button */}
        <View style={styles.header}>
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.skipButtonPressed,
            ]}
            accessibilityLabel="Skip onboarding"
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.slideContainer}>
              {/* Icon with clean border */}
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0.3,
                  scale: currentIndex === index ? 1 : 0.8
                }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
              </MotiView>

              {/* Title */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  translateY: currentIndex === index ? 0 : 20
                }}
                transition={{ type: 'timing', duration: 400, delay: 100 }}
              >
                <Text style={styles.title}>{item.title}</Text>
              </MotiView>

              {/* Description */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{
                  opacity: currentIndex === index ? 1 : 0,
                  translateY: currentIndex === index ? 0 : 20
                }}
                transition={{ type: 'timing', duration: 400, delay: 200 }}
              >
                <Text style={styles.description}>{item.description}</Text>
              </MotiView>
            </View>
          )}
        />

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing['4'] }]}>
          {/* Page Indicators - Clean dots */}
          <View style={styles.indicators}>
            {slides.map((_, index) => (
              <MotiView
                key={index}
                animate={{
                  width: currentIndex === index ? 28 : 8,
                  backgroundColor: currentIndex === index ? '#1F2937' : '#E5E7EB',
                }}
                transition={{ type: 'spring', damping: 15 }}
                style={styles.indicator}
              />
            ))}
          </View>

          {/* Continue Button - Solid dark */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.continueButtonPressed,
            ]}
            accessibilityLabel={isLastSlide ? 'Get started' : 'Continue'}
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>
              {isLastSlide ? 'Get Started' : 'Continue'}
            </Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['2'],
  },
  skipButton: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
  },
  skipButtonPressed: {
    opacity: 0.7,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['8'],
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['8'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: spacing['3'],
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing['4'],
  },
  bottomSection: {
    paddingHorizontal: spacing['6'],
    gap: spacing['6'],
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  continueButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
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
});
