import { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MotiView, AnimatePresence } from '../components/MotiWrapper';
import { Text } from 'tamagui';
import { Heart, Star, Sparkles } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ToastType = 'like' | 'supernova' | 'karma';

interface ContributionToastProps {
  visible: boolean;
  type: ToastType;
  causeName?: string;
  karmaEarned?: number;
  onDismiss?: () => void;
}

/**
 * Contribution feedback toast
 * Shows brief feedback when user interacts with content
 */
export function ContributionToast({
  visible,
  type,
  causeName,
  karmaEarned,
  onDismiss,
}: ContributionToastProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible && onDismiss) {
      const timer = setTimeout(onDismiss, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  const getToastConfig = () => {
    switch (type) {
      case 'like':
        return {
          icon: <Heart size={18} color="#EF4444" fill="#EF4444" />,
          title: 'You supported this creator!',
          subtitle: causeName ? `Contributing to ${causeName}` : undefined,
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
        };
      case 'supernova':
        return {
          icon: <Star size={18} color="#EC4899" fill="#EC4899" />,
          title: 'Supernova sent!',
          subtitle: causeName
            ? `100 Karma donated to ${causeName}`
            : '100 Karma donated',
          bgColor: '#FDF2F8',
          borderColor: '#FBCFE8',
        };
      case 'karma':
        return {
          icon: <Sparkles size={18} color="#F59E0B" />,
          title: `+${karmaEarned || 1} Karma earned!`,
          subtitle: 'Keep spreading positivity',
          bgColor: '#FEF3C7',
          borderColor: '#FDE68A',
        };
      default:
        return {
          icon: <Heart size={18} color="#6B7280" />,
          title: 'Thank you!',
          bgColor: '#F9FAFB',
          borderColor: '#E5E7EB',
        };
    }
  };

  const config = getToastConfig();

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{ opacity: 0, translateY: -20, scale: 0.95 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15 }}
          style={[
            styles.container,
            {
              top: insets.top + 12,
              backgroundColor: config.bgColor,
              borderColor: config.borderColor,
            },
          ]}
        >
          <View style={styles.iconContainer}>{config.icon}</View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{config.title}</Text>
            {config.subtitle && (
              <Text style={styles.subtitle}>{config.subtitle}</Text>
            )}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 999,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});
