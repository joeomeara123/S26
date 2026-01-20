import { useCallback } from 'react';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../../components/MotiWrapper';
import { Text, Avatar, Image } from 'tamagui';
import { ArrowLeft, Grid, Heart, Sparkles, Check, UserPlus, UserCheck } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import { spacing } from '../../../constants/spacing';
import { mockUsers, getUserById } from '../../../data/users';
import { causes } from '../../../data/causes';
import { getPostsByUser, mockPosts } from '../../../data/posts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_SIZE = (SCREEN_WIDTH - spacing['4'] * 2 - GRID_GAP * 2) / 3;

/**
 * Other User Profile Screen
 * Shows another user's profile with follow button
 */
export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Get user data
  const user = getUserById(id || '') || mockUsers[0];
  const userCause = causes[user.cause];
  const userPosts = getPostsByUser(user.id);

  // Local follow state
  const [isFollowing, setIsFollowing] = useState(false);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleFollow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFollowing(!isFollowing);
  }, [isFollowing]);

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#F9FAFB', '#FAFAFA', '#FAFAFA']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + spacing['8'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#1F2937" />
          </Pressable>
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>@{user.username}</Text>
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Check size={10} color="white" strokeWidth={3} />
              </View>
            )}
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Profile Info */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.profileSection}
        >
          {/* Avatar and Stats */}
          <View style={styles.avatarStatsRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  <Avatar circular size="$10">
                    <Avatar.Image src={user.avatar} />
                    <Avatar.Fallback backgroundColor="#1F2937">
                      <Text style={styles.avatarFallback}>{user.name.charAt(0)}</Text>
                    </Avatar.Fallback>
                  </Avatar>
                </View>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <StatItem value={user.posts} label="Posts" />
              <StatItem value={user.followers} label="Followers" />
              <StatItem value={user.following} label="Following" />
            </View>
          </View>

          {/* Name and Bio */}
          <View style={styles.bioSection}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{user.name}</Text>
              <View style={[styles.causeBadge, { backgroundColor: `${userCause.color}15` }]}>
                <Text style={styles.causeBadgeIcon}>{userCause.icon}</Text>
                <Text style={[styles.causeBadgeText, { color: userCause.color }]}>
                  {userCause.shortName}
                </Text>
              </View>
            </View>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>

          {/* Karma Badge */}
          <View style={styles.karmaBadge}>
            <View style={styles.karmaLeft}>
              <View style={styles.karmaIconContainer}>
                <Sparkles size={16} color="#F59E0B" />
              </View>
              <Text style={styles.karmaLabel}>Karma</Text>
            </View>
            <Text style={styles.karmaValue}>{user.karma}</Text>
          </View>

          {/* Follow Button */}
          <Pressable
            onPress={handleFollow}
            style={({ pressed }) => [
              isFollowing ? styles.followingButton : styles.followButton,
              pressed && styles.buttonPressed,
            ]}
            accessibilityLabel={isFollowing ? 'Unfollow' : 'Follow'}
          >
            {isFollowing ? (
              <>
                <UserCheck size={18} color="#1F2937" />
                <Text style={styles.followingButtonText}>Following</Text>
              </>
            ) : (
              <>
                <UserPlus size={18} color="white" />
                <Text style={styles.followButtonText}>Follow</Text>
              </>
            )}
          </Pressable>
        </MotiView>

        {/* Posts Tab */}
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, styles.tabActive]} accessibilityLabel="Posts grid">
            <Grid size={22} color="#1F2937" />
          </Pressable>
          <Pressable style={styles.tab} accessibilityLabel="Liked posts">
            <Heart size={22} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <MotiView
                key={post.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 200, delay: index * 50 }}
              >
                <Pressable style={({ pressed }) => [styles.postItem, pressed && { opacity: 0.8 }]}>
                  <Image
                    source={{ uri: post.mediaUrl }}
                    width={GRID_SIZE}
                    height={GRID_SIZE}
                    borderRadius={2}
                  />
                </Pressable>
              </MotiView>
            ))
          ) : (
            // Show some posts from mockPosts for demo
            mockPosts.slice(0, 6).map((post, index) => (
              <MotiView
                key={post.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 200, delay: index * 50 }}
              >
                <Pressable style={({ pressed }) => [styles.postItem, pressed && { opacity: 0.8 }]}>
                  <Image
                    source={{ uri: post.mediaUrl }}
                    width={GRID_SIZE}
                    height={GRID_SIZE}
                    borderRadius={2}
                  />
                </Pressable>
              </MotiView>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  const formatValue = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Pressable style={({ pressed }) => [styles.statItem, pressed && { opacity: 0.7 }]}>
      <Text style={styles.statValue}>{formatValue(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    paddingVertical: spacing['3'],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    marginBottom: spacing['4'],
  },
  avatarStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['5'],
    marginBottom: spacing['4'],
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  bioSection: {
    gap: spacing['1'],
    marginBottom: spacing['4'],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  causeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['2'],
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  causeBadgeIcon: {
    fontSize: 12,
  },
  causeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  karmaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    borderRadius: 14,
    marginBottom: spacing['4'],
  },
  karmaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  karmaIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  karmaLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  karmaValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F59E0B',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    gap: spacing['2'],
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  followingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: spacing['2'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  followingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: spacing['1'],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing['3'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
    marginBottom: -1,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  postItem: {
    // Size set inline
  },
});
