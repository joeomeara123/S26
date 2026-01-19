import { useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text } from 'tamagui';
import { Camera, Image, Video, FileText, Smile, ChevronRight } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '../../constants/spacing';

/**
 * Create Post Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean option cards with borders
 * - Solid dark icons
 */
export default function CreateScreen() {
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

  const handleOption = useCallback((option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to creation flow
  }, []);

  const options = [
    { id: 'photo', icon: Image, label: 'Photo', subtitle: 'Share a moment' },
    { id: 'video', icon: Video, label: 'Video', subtitle: 'Create short clips' },
    { id: 'camera', icon: Camera, label: 'Camera', subtitle: 'Capture now' },
    { id: 'story', icon: Smile, label: 'Story', subtitle: '24h content' },
    { id: 'text', icon: FileText, label: 'Text Post', subtitle: 'Share thoughts' },
  ];

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
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.header}
        >
          <Text style={styles.title}>Create</Text>
          <Text style={styles.subtitle}>Share something amazing with the world</Text>
        </MotiView>

        {/* Options Grid */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <MotiView
              key={option.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 300, delay: index * 80 }}
            >
              <Pressable
                onPress={() => handleOption(option.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  pressed && styles.optionCardPressed,
                ]}
                accessibilityLabel={`Create ${option.label}`}
              >
                {/* Icon Container - Clean style */}
                <View style={styles.iconContainer}>
                  <option.icon size={24} color="#1F2937" />
                </View>

                {/* Content */}
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>

                {/* Arrow indicator */}
                <View style={styles.arrowContainer}>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </Pressable>
            </MotiView>
          ))}
        </View>

        {/* Coming Soon Note */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 600 }}
          style={styles.comingSoonContainer}
        >
          <View style={styles.comingSoonBadge}>
            <Camera size={24} color="#1F2937" />
          </View>
          <Text style={styles.comingSoonTitle}>Full Creation Suite</Text>
          <Text style={styles.comingSoonText}>
            Image cropping, carousels, filters{'\n'}and more coming in Week 7
          </Text>
        </MotiView>
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
    paddingHorizontal: spacing['4'],
  },
  header: {
    paddingHorizontal: spacing['2'],
    marginBottom: spacing['6'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: spacing['1'],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  optionsContainer: {
    gap: spacing['3'],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing['4'],
    gap: spacing['4'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing['16'],
  },
  comingSoonBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: spacing['2'],
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
