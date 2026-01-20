import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { Text, Avatar, Image } from 'tamagui';
import { Settings, Grid, Bookmark, Sparkles, LogOut, Check, Star } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { useInteractionStore } from '../../store/interactionStore';
import { causes } from '../../data/causes';
import { mockPosts } from '../../data/posts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const GRID_SIZE = (SCREEN_WIDTH - spacing['4'] * 2 - GRID_GAP * 2) / 3;

/**
 * Profile Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel
 * - Subtle animated gradient background
 * - Clean avatar ring
 * - Solid accents
 */
type ProfileTab = 'posts' | 'saved' | 'supernovas';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { supernovaedPosts, savedPosts } = useInteractionStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  // Get supernovaed posts from mock data
  const supernovaPosts = useMemo(() => {
    return mockPosts.filter(post => supernovaedPosts.includes(post.id));
  }, [supernovaedPosts]);

  // Get saved posts from mock data
  const savedPostsList = useMemo(() => {
    return mockPosts.filter(post => savedPosts.includes(post.id));
  }, [savedPosts]);

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

  const userCause = user?.cause ? causes[user.cause as keyof typeof causes] : causes.EC;

  // Mock stats
  const stats = {
    posts: 42,
    followers: 1234,
    following: 567,
  };

  const handleSettings = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to settings
  }, []);

  const handleLogout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
    router.replace('/(auth)/welcome');
  }, [logout, router]);

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
          { paddingTop: insets.top, paddingBottom: insets.bottom + spacing['8'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>@{user?.username || 'demo_user'}</Text>
            <View style={styles.verifiedBadge}>
              <Check size={10} color="white" strokeWidth={3} />
            </View>
          </View>
          <Pressable
            onPress={handleSettings}
            style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
            accessibilityLabel="Settings"
          >
            <Settings size={22} color="#1F2937" />
          </Pressable>
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
              {/* Clean avatar ring - solid border */}
              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  <Avatar circular size="$10">
                    <Avatar.Image src={user?.avatar || `https://i.pravatar.cc/200?u=${user?.id}`} />
                    <Avatar.Fallback backgroundColor="#1F2937">
                      <Text style={styles.avatarFallback}>{user?.name?.charAt(0) || 'D'}</Text>
                    </Avatar.Fallback>
                  </Avatar>
                </View>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <StatItem value={stats.posts} label="Posts" />
              <StatItem value={stats.followers} label="Followers" />
              <StatItem value={stats.following} label="Following" />
            </View>
          </View>

          {/* Name and Bio */}
          <View style={styles.bioSection}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{user?.name || 'Demo User'}</Text>
              <View style={styles.causeBadge}>
                <Text style={styles.causeBadgeIcon}>{userCause.icon}</Text>
                <Text style={styles.causeBadgeText}>
                  {userCause.shortName}
                </Text>
              </View>
            </View>
            <Text style={styles.bioText}>
              Creating positive vibes | Spreading good energy
            </Text>
          </View>

          {/* Karma Badge */}
          <View style={styles.karmaBadge}>
            <View style={styles.karmaLeft}>
              <View style={styles.karmaIconContainer}>
                <Sparkles size={16} color="#F59E0B" />
              </View>
              <Text style={styles.karmaLabel}>Karma</Text>
            </View>
            <Text style={styles.karmaValue}>{user?.karma || 67}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
              accessibilityLabel="Edit profile"
            >
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
              accessibilityLabel="Share profile"
            >
              <Text style={styles.actionButtonText}>Share Profile</Text>
            </Pressable>
          </View>
        </MotiView>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            accessibilityLabel="Posts grid"
            onPress={() => setActiveTab('posts')}
          >
            <Grid size={22} color={activeTab === 'posts' ? '#1F2937' : '#9CA3AF'} />
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
            accessibilityLabel="Saved posts"
            onPress={() => setActiveTab('saved')}
          >
            <Bookmark size={22} color={activeTab === 'saved' ? '#1F2937' : '#9CA3AF'} />
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'supernovas' && styles.tabActive]}
            accessibilityLabel="Supernovas"
            onPress={() => setActiveTab('supernovas')}
          >
            <Star
              size={22}
              color={activeTab === 'supernovas' ? '#EC4899' : '#9CA3AF'}
              fill={activeTab === 'supernovas' ? '#EC4899' : 'transparent'}
            />
            {supernovaedPosts.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{supernovaedPosts.length}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {activeTab === 'posts' && mockPosts.slice(0, 9).map((post, index) => (
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
          ))}

          {activeTab === 'saved' && (
            savedPostsList.length > 0 ? (
              savedPostsList.map((post, index) => (
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
              <View style={styles.emptyState}>
                <Bookmark size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No saved posts yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Save posts to find them easily later
                </Text>
              </View>
            )
          )}

          {activeTab === 'supernovas' && (
            supernovaPosts.length > 0 ? (
              supernovaPosts.map((post, index) => (
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
                    {/* Supernova badge overlay */}
                    <View style={styles.supernovaBadge}>
                      <Star size={12} color="white" fill="white" />
                    </View>
                  </Pressable>
                </MotiView>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Star size={48} color="#FBCFE8" fill="#FBCFE8" />
                <Text style={styles.emptyStateText}>No Supernovas yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Give a Supernova to posts you love!{'\n'}It costs 100 karma and supports their cause.
                </Text>
              </View>
            )
          )}
        </View>

        {/* Logout Button */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 500 }}
          style={styles.logoutSection}
        >
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
            accessibilityLabel="Log out"
          >
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  const formatValue = (num: number) => {
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
    paddingVertical: spacing['3'],
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  usernameText: {
    fontSize: 22,
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
  settingsButton: {
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
    backgroundColor: '#F3F4F6',
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
    color: '#6B7280',
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
  actionButtons: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  actionButton: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 14,
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
    position: 'relative',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2937',
    marginBottom: -1,
  },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: '25%',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    minHeight: 200,
  },
  postItem: {
    position: 'relative',
  },
  supernovaBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    width: SCREEN_WIDTH - spacing['4'] * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['8'],
    gap: spacing['3'],
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutSection: {
    marginTop: spacing['8'],
    paddingHorizontal: spacing['2'],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    gap: spacing['2'],
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
});
