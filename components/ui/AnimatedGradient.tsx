import { useEffect } from 'react';
import { Dimensions, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DIAGONAL = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);

interface AnimatedGradientProps {
  style?: ViewStyle;
  speed?: number;
  colors?: string[];
}

export function AnimatedGradient({
  style,
  speed = 1,
  colors: colorOverride,
}: AnimatedGradientProps) {
  const spectrumColors = colorOverride ?? [...colors.gradients.spectrum];

  const rotation = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000 / speed, easing: Easing.linear }),
      -1,
      false,
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 8000 / speed, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [speed]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const orb1Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.15, 0.25]),
  }));

  const orb2Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.2, 0.12]),
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.base} />

      <Animated.View style={[styles.sweepContainer, sweepStyle]}>
        <LinearGradient
          colors={[
            spectrumColors[0],
            spectrumColors[1],
            spectrumColors[2],
            spectrumColors[3],
            spectrumColors[4],
            spectrumColors[5],
            spectrumColors[6],
            spectrumColors[0],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sweepGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient
          colors={[spectrumColors[0], 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient
          colors={[spectrumColors[4], 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
  },
  sweepContainer: {
    position: 'absolute',
    width: DIAGONAL,
    height: DIAGONAL,
    left: (SCREEN_WIDTH - DIAGONAL) / 2,
    top: (SCREEN_HEIGHT - DIAGONAL) / 2,
    opacity: 0.35,
  },
  sweepGradient: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: SCREEN_WIDTH * 0.7,
  },
  orb1: {
    width: SCREEN_WIDTH * 1.4,
    height: SCREEN_WIDTH * 1.4,
    left: SCREEN_WIDTH * 0.25 - SCREEN_WIDTH * 0.7,
    top: SCREEN_HEIGHT * 0.35 - SCREEN_WIDTH * 0.7,
  },
  orb2: {
    width: SCREEN_WIDTH * 1.4,
    height: SCREEN_WIDTH * 1.4,
    left: SCREEN_WIDTH * 0.75 - SCREEN_WIDTH * 0.7,
    top: SCREEN_HEIGHT * 0.65 - SCREEN_WIDTH * 0.7,
  },
});
