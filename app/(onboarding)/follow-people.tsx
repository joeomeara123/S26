import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text, Avatar } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { mockUsers, User } from '../../data/users';
import { causes } from '../../data/causes';

const MIN_FOLLOWS = 5;

/**
 * Follow People Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean user cards with borders
 * - Solid dark buttons
 */
export default function FollowPeopleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();

  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

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

  const followCount = followedIds.size;
  const progress = Math.min((followCount / MIN_FOLLOWS) * 100, 100);
  const canContinue = followCount >= MIN_FOLLOWS;

  const handleFollow = useCallback((userId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFollowedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const handleContinue = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    router.replace('/(tabs)');
  }, [completeOnboarding, router]);

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
        <View style={styles.header}>
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <Text style={styles.title}>Follow Creators</Text>
            <Text style={styles.subtitle}>
              Follow at least {MIN_FOLLOWS} creators to build your personalized feed.
            </Text>
          </MotiView>
        </View>

        {/* Progress Bar - Clean solid style */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.progressSection}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressCount}>
              {followCount} / {MIN_FOLLOWS} following
            </Text>
            <Text style={[styles.progressStatus, canContinue && styles.progressStatusReady]}>
              {canContinue ? 'Ready!' : `${MIN_FOLLOWS - followCount} more`}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <MotiView
              animate={{ width: `${progress}%` }}
              transition={{ type: 'timing', duration: 300 }}
              style={[
                styles.progressFill,
                { backgroundColor: canContinue ? '#22C55E' : '#1F2937' }
              ]}
            />
          </View>
        </MotiView>

        {/* Users List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.usersList}>
            {mockUsers.map((user, index) => (
              <MotiView
                key={user.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 250, delay: index * 50 }}
              >
                <UserCard
                  user={user}
                  isFollowing={followedIds.has(user.id)}
                  onToggleFollow={() => handleFollow(user.id)}
                />
              </MotiView>
            ))}
          </View>
        </ScrollView>

        {/* Continue Button - Solid dark */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing['4'] }]}>
          <Pressable
            onPress={handleContinue}
            disabled={!canContinue}
            style={({ pressed }) => [
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled,
              pressed && canContinue && styles.continueButtonPressed,
            ]}
            accessibilityLabel="Start using Supernova"
            accessibilityRole="button"
          >
            <Text style={[
              styles.continueButtonText,
              !canContinue && styles.continueButtonTextDisabled,
            ]}>
              {canContinue ? "Let's Go" : `Follow ${MIN_FOLLOWS - followCount} more`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function UserCard({
  user,
  isFollowing,
  onToggleFollow,
}: {
  user: User;
  isFollowing: boolean;
  onToggleFollow: () => void;
}) {
  const userCause = causes[user.cause];

  return (
    <View style={styles.userCard}>
      {/* Avatar */}
      <Avatar circular size="$5">
        <Avatar.Image src={user.avatar} />
        <Avatar.Fallback backgroundColor="#1F2937">
          <Text style={{ color: 'white', fontWeight: '600' }}>{user.name.charAt(0)}</Text>
        </Avatar.Fallback>
      </Avatar>

      {/* Info */}
      <View style={styles.userInfo}>
        <View style={styles.userName}>
          <Text style={styles.userNameText}>{user.name}</Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Check size={10} color="white" strokeWidth={3} />
            </View>
          )}
        </View>
        <Text style={styles.userHandle}>@{user.username}</Text>
        <View style={styles.userMeta}>
          <Text style={styles.userCauseIcon}>{userCause?.icon}</Text>
          <Text style={styles.userCauseName}>
            {userCause?.shortName}
          </Text>
          <Text style={styles.userFollowers}>
            • {(user.followers / 1000).toFixed(1)}K followers
          </Text>
        </View>
      </View>

      {/* Follow Button - Solid style */}
      <Pressable
        onPress={onToggleFollow}
        style={({ pressed }) => [
          styles.followButton,
          isFollowing ? styles.followButtonFollowing : styles.followButtonNotFollowing,
          pressed && styles.followButtonPressed,
        ]}
        accessibilityLabel={isFollowing ? `Unfollow ${user.name}` : `Follow ${user.name}`}
        accessibilityRole="button"
      >
        <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextFollowing]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
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
    paddingHorizontal: spacing['6'],
    marginBottom: spacing['4'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: spacing['2'],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  progressSection: {
    paddingHorizontal: spacing['6'],
    marginBottom: spacing['6'],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['2'],
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressStatus: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressStatusReady: {
    color: '#22C55E',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
  },
  usersList: {
    gap: spacing['3'],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  userNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHandle: {
    fontSize: 13,
    color: '#6B7280',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userCauseIcon: {
    fontSize: 12,
  },
  userCauseName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  userFollowers: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  followButton: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  followButtonNotFollowing: {
    backgroundColor: '#1F2937',
  },
  followButtonFollowing: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  followButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  followButtonTextFollowing: {
    color: '#1F2937',
  },
  bottomSection: {
    paddingHorizontal: spacing['6'],
    paddingTop: spacing['4'],
  },
  continueButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
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
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
