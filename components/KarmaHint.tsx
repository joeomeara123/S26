import { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { MotiView, AnimatePresence } from '../components/MotiWrapper';
import { Text } from 'tamagui';
import { Sparkles, X } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface KarmaHintProps {
  visible: boolean;
  onDismiss: () => void;
}

/**
 * Karma onboarding hint tooltip
 * Shows once after first interaction to educate users about karma
 */
export function KarmaHint({ visible, onDismiss }: KarmaHintProps) {
  const insets = useSafeAreaInsets();

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{ opacity: 0, translateY: 20, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15 }}
          style={[styles.container, { bottom: insets.bottom + 100 }]}
        >
          {/* Arrow pointing down to tab bar */}
          <View style={styles.arrow} />

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Sparkles size={24} color="#F59E0B" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Your actions earn Karma!</Text>
              <Text style={styles.subtitle}>
                Likes, comments, and shares help causes you care about. Tap the Karma tab to see your impact!
              </Text>
            </View>

            <Pressable
              onPress={onDismiss}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              hitSlop={10}
            >
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>

          {/* Progress bar */}
          <MotiView
            from={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ type: 'timing', duration: 8000 }}
            style={styles.progressBar}
          />
        </MotiView>
      )}
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 998,
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: 30, // Offset to point at karma tab
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#F59E0B',
    transformOrigin: 'left',
  },
});
