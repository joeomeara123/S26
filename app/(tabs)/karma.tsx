import { useCallback, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text } from 'tamagui';
import { Sparkles, Star, TrendingUp, Heart, Gift } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { causes, formatMoney } from '../../data/causes';

/**
 * Karma Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Solid progress bars and buttons
 */
export default function KarmaScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

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

  const userKarma = user?.karma || 67;
  const selectedCause = user?.cause ? causes[user.cause as keyof typeof causes] : causes.EC;
  const progress = Math.min((userKarma / 100) * 100, 100);
  const canSupernova = userKarma >= 100;

  const handleGiveSupernova = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing['4'], paddingBottom: insets.bottom + spacing['8'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.header}
        >
          <Text style={styles.title}>Karma</Text>
          <View style={styles.karmaChip}>
            <Sparkles size={18} color="#F59E0B" />
            <Text style={styles.karmaValue}>{userKarma}</Text>
          </View>
        </MotiView>

        {/* Karma Progress Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <View style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
              <View>
                <Text style={styles.progressCardTitle}>Your Karma Progress</Text>
                <Text style={styles.progressCardSubtitle}>
                  {canSupernova ? 'Ready to give Supernovas!' : `${100 - userKarma} more to unlock Supernova`}
                </Text>
              </View>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{userKarma}/100</Text>
              </View>
            </View>

            {/* Progress Bar - Solid style */}
            <View style={styles.progressTrack}>
              <MotiView
                animate={{ width: `${progress}%` }}
                transition={{ type: 'timing', duration: 500 }}
                style={[
                  styles.progressFill,
                  { backgroundColor: canSupernova ? '#22C55E' : '#1F2937' }
                ]}
              />
            </View>

            {/* Give Supernova Button - Solid style */}
            <Pressable
              onPress={handleGiveSupernova}
              disabled={!canSupernova}
              style={({ pressed }) => [
                styles.supernovaButton,
                !canSupernova && styles.supernovaButtonDisabled,
                pressed && canSupernova && styles.supernovaButtonPressed,
              ]}
              accessibilityLabel="Give Supernova"
              accessibilityRole="button"
            >
              <Star size={20} color={canSupernova ? 'white' : '#9CA3AF'} fill={canSupernova ? 'white' : 'transparent'} />
              <Text style={[
                styles.supernovaButtonText,
                !canSupernova && styles.supernovaButtonTextDisabled,
              ]}>
                Give a Supernova (100 Karma)
              </Text>
            </Pressable>
          </View>
        </MotiView>

        {/* Your Cause Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <View style={styles.causeCard}>
            <View style={styles.causeHeader}>
              <View style={styles.causeIconContainer}>
                <Text style={styles.causeIcon}>{selectedCause.icon}</Text>
              </View>
              <View style={styles.causeInfo}>
                <Text style={styles.causeName}>{selectedCause.name}</Text>
                <Text style={styles.causeLabel}>Your selected cause</Text>
              </View>
              <Pressable style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </Pressable>
            </View>

            <Text style={styles.causeDescription}>{selectedCause.description}</Text>

            {/* Stats */}
            <View style={styles.causeStats}>
              <View style={styles.causeStat}>
                <Text style={styles.causeStatValue}>
                  {formatMoney(selectedCause.totalRaised)}
                </Text>
                <Text style={styles.causeStatLabel}>Total Raised</Text>
              </View>
              <View style={styles.causeStatDivider} />
              <View style={styles.causeStat}>
                <Text style={styles.causeStatValue}>
                  {(selectedCause.activeUsers / 1000).toFixed(1)}K
                </Text>
                <Text style={styles.causeStatLabel}>Supporters</Text>
              </View>
            </View>
          </View>
        </MotiView>

        {/* How to Earn Karma */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <Text style={styles.sectionTitle}>How to Earn Karma</Text>
          <View style={styles.karmaActionsContainer}>
            <KarmaAction icon={Heart} label="Like a post" karma={1} />
            <KarmaAction icon={TrendingUp} label="Share content" karma={5} />
            <KarmaAction icon={Gift} label="Receive a Supernova" karma={10} />
            <KarmaAction icon={Star} label="Daily login" karma={5} />
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

function KarmaAction({
  icon: Icon,
  label,
  karma,
}: {
  icon: typeof Heart;
  label: string;
  karma: number;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.karmaActionCard, pressed && styles.karmaActionCardPressed]}>
      <View style={styles.karmaActionIcon}>
        <Icon size={20} color="#1F2937" />
      </View>
      <Text style={styles.karmaActionLabel}>{label}</Text>
      <View style={styles.karmaActionReward}>
        <Text style={styles.karmaActionValue}>+{karma}</Text>
        <Sparkles size={14} color="#F59E0B" />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['6'],
    paddingHorizontal: spacing['2'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  karmaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: 20,
  },
  karmaValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F59E0B',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing['5'],
    marginBottom: spacing['4'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['4'],
  },
  progressCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  progressCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: 10,
  },
  progressBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: spacing['5'],
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  supernovaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    gap: spacing['2'],
  },
  supernovaButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  supernovaButtonPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#374151',
  },
  supernovaButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  supernovaButtonTextDisabled: {
    color: '#9CA3AF',
  },
  causeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing['5'],
    marginBottom: spacing['6'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  causeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    marginBottom: spacing['3'],
  },
  causeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  causeIcon: {
    fontSize: 24,
  },
  causeInfo: {
    flex: 1,
  },
  causeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  causeLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  changeButton: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  causeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: spacing['4'],
  },
  causeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  causeStat: {
    flex: 1,
  },
  causeStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  causeStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  causeStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing['4'],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: spacing['4'],
    paddingHorizontal: spacing['2'],
  },
  karmaActionsContainer: {
    gap: spacing['3'],
  },
  karmaActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing['4'],
    gap: spacing['3'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  karmaActionCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#F9FAFB',
  },
  karmaActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  karmaActionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  karmaActionReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  karmaActionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
});
