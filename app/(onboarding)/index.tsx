import { useState, useCallback, useRef } from 'react';
import { Dimensions, FlatList, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button } from 'tamagui';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: '🎬',
    title: 'Discover Amazing Content',
    description: 'Swipe through a feed of inspiring videos and posts from creators who spread positivity.',
  },
  {
    id: '2',
    icon: '✨',
    title: 'Give Supernovas',
    description: 'When you love something, give it a Supernova! It\'s our special way of showing appreciation.',
  },
  {
    id: '3',
    icon: '💚',
    title: 'Support Causes You Care About',
    description: 'Every Supernova contributes to real-world charities. Your engagement makes a difference!',
  },
  {
    id: '4',
    icon: '⭐',
    title: 'Earn Karma',
    description: 'Engage with content to earn karma. Reach 100 karma to unlock the power to give Supernovas!',
  },
];

/**
 * Onboarding Intro Screens
 * Horizontal swipe through app features
 */
export default function OnboardingIntro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
      paddingBottom={insets.bottom + spacing['4']}
    >
      {/* Skip Button */}
      <XStack justifyContent="flex-end" paddingHorizontal={spacing['4']} paddingVertical={spacing['2']}>
        <Button
          backgroundColor="transparent"
          color="$colorPress"
          fontSize={16}
          onPress={handleSkip}
          accessibilityLabel="Skip onboarding"
        >
          Skip
        </Button>
      </XStack>

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
          <YStack
            width={SCREEN_WIDTH}
            flex={1}
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={spacing['8']}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: currentIndex === index ? 1 : 0.5, scale: currentIndex === index ? 1 : 0.9 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Text fontSize={80} textAlign="center" marginBottom={spacing['8']}>
                {item.icon}
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: currentIndex === index ? 1 : 0, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 100 }}
            >
              <Text
                fontSize={28}
                fontWeight="700"
                color="$color"
                textAlign="center"
                marginBottom={spacing['4']}
              >
                {item.title}
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: currentIndex === index ? 1 : 0, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 200 }}
            >
              <Text
                fontSize={16}
                color="$colorPress"
                textAlign="center"
                lineHeight={24}
              >
                {item.description}
              </Text>
            </MotiView>
          </YStack>
        )}
      />

      {/* Bottom Section */}
      <YStack paddingHorizontal={spacing['6']} gap={spacing['6']}>
        {/* Page Indicators */}
        <XStack justifyContent="center" gap={spacing['2']}>
          {slides.map((_, index) => (
            <MotiView
              key={index}
              animate={{
                width: currentIndex === index ? 24 : 8,
                backgroundColor: currentIndex === index ? colors.primary : colors.light.border,
              }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                height: 8,
                borderRadius: 4,
              }}
            />
          ))}
        </XStack>

        {/* Continue Button */}
        <Button
          size="$5"
          backgroundColor={colors.primary}
          color="white"
          fontWeight="600"
          borderRadius={16}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
          onPress={handleNext}
          accessibilityLabel={currentIndex === slides.length - 1 ? 'Get started' : 'Continue'}
        >
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
        </Button>
      </YStack>
    </YStack>
  );
}
