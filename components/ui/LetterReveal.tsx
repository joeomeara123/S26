import { useEffect, useMemo } from 'react';
import { View, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text } from 'tamagui';

interface LetterRevealProps {
  text: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  letterDelay?: number;
  letterDuration?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export function LetterReveal({
  text,
  style,
  containerStyle,
  letterDelay = 70,
  letterDuration = 350,
  startDelay = 0,
  onComplete,
}: LetterRevealProps) {
  const letters = useMemo(() => text.split(''), [text]);
  const totalDuration = startDelay + letters.length * letterDelay + letterDuration;

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, totalDuration);
      return () => clearTimeout(timer);
    }
  }, [totalDuration, onComplete]);

  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'center' }, containerStyle]}>
      {letters.map((letter, index) => (
        <AnimatedLetter
          key={index}
          letter={letter}
          delay={startDelay + index * letterDelay}
          duration={letterDuration}
          style={style}
        />
      ))}
    </View>
  );
}

function AnimatedLetter({
  letter,
  delay,
  duration,
  style,
}: {
  letter: string;
  delay: number;
  duration: number;
  style?: TextStyle;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 12 }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={style}>{letter}</Text>
    </Animated.View>
  );
}
