import { useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MotiView, AnimatePresence } from '../components/MotiWrapper';
import { Star } from '@tamagui/lucide-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SupernovaAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

/**
 * Supernova celebration animation
 * Shows a star burst effect when user supernovas a post
 */
export function SupernovaAnimation({ visible, onComplete }: SupernovaAnimationProps) {
  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <View style={styles.container} pointerEvents="none">
          {/* Central star burst */}
          <MotiView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 12 }}
            style={styles.centerStar}
          >
            <Star size={64} color="#EC4899" fill="#EC4899" />
          </MotiView>

          {/* Particle stars - 8 directions */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const distance = 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <MotiView
                key={i}
                from={{ opacity: 0, scale: 0, translateX: 0, translateY: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.3],
                  translateX: x,
                  translateY: y,
                }}
                transition={{
                  type: 'timing',
                  duration: 800,
                  delay: 100,
                }}
                style={styles.particle}
              >
                <Star size={20} color="#F59E0B" fill="#F59E0B" />
              </MotiView>
            );
          })}

          {/* Screen flash overlay */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.flashOverlay}
          />
        </View>
      )}
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  centerStar: {
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EC4899',
  },
});
