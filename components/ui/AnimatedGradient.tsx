import { useEffect } from 'react';
import { Dimensions, StyleSheet, View, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Animated gradient background using a pre-rendered mesh gradient JPEG.
 *
 * The gradient image is generated with Gaussian-weighted color interpolation
 * and stochastic dithering, producing smooth, banding-free transitions.
 * JPEG compression adds natural dithering at the decoder level.
 *
 * A slow pan + scale animation gives the gradient a living, organic feel.
 */

const gradientBg = require('../../assets/textures/gradient-bg.jpg');

// Slightly oversized to allow room for drift animation
const OVERFLOW = 1.15;

interface AnimatedGradientProps {
  style?: ViewStyle;
  speed?: number;
}

export function AnimatedGradient({
  style,
  speed = 1,
}: AnimatedGradientProps) {
  const drift = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    // Slow continuous drift cycle
    drift.value = withRepeat(
      withTiming(1, { duration: 40000 / speed, easing: Easing.linear }),
      -1,
      false,
    );
    // Gentle scale breathing
    breathe.value = withRepeat(
      withTiming(1, { duration: 12000 / speed, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    // Gentle drift in a figure-8 pattern
    const angle = drift.value * Math.PI * 2;
    const dx = Math.sin(angle) * SCREEN_WIDTH * 0.03;
    const dy = Math.sin(angle * 2) * SCREEN_HEIGHT * 0.015;

    // Subtle scale pulse
    const scale = OVERFLOW + interpolate(breathe.value, [0, 1], [0, 0.03]);

    return {
      transform: [
        { scale },
        { translateX: dx },
        { translateY: dy },
      ],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          source={gradientBg}
          style={styles.gradientImage}
          contentFit="cover"
        />
      </Animated.View>

      {/* Subtle dark overlay for white text readability */}
      <View style={styles.darkOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientImage: {
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
});
