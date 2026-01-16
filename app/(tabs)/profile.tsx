import { useCallback } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Avatar, Image } from 'tamagui';
import { Settings, Grid, Bookmark, Sparkles, MapPin, Link } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing, layout } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { causes } from '../../data/causes';
import { mockPosts } from '../../data/posts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = (SCREEN_WIDTH - spacing['4'] * 2 - spacing['1'] * 2) / 3;

/**
 * Profile Screen
 * User profile with stats, bio, and posts grid
 */
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.light.background }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + spacing['8'],
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <XStack
        paddingHorizontal={spacing['4']}
        paddingVertical={spacing['3']}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={20} fontWeight="700" color="$color">
          @{user?.username || 'demo_user'}
        </Text>
        <Button
          size="$4"
          circular
          backgroundColor="transparent"
          icon={<Settings size={24} color={colors.light.text} />}
          onPress={handleSettings}
          accessibilityLabel="Settings"
        />
      </XStack>

      {/* Profile Info */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <YStack paddingHorizontal={spacing['4']} marginBottom={spacing['6']}>
          {/* Avatar and Stats */}
          <XStack alignItems="center" gap={spacing['6']} marginBottom={spacing['4']}>
            <Avatar circular size="$10">
              <Avatar.Image src={user?.avatar || `https://i.pravatar.cc/200?u=${user?.id}`} />
              <Avatar.Fallback backgroundColor={colors.primary}>
                <Text color="white" fontSize={32} fontWeight="600">
                  {user?.name?.charAt(0) || 'D'}
                </Text>
              </Avatar.Fallback>
            </Avatar>

            <XStack flex={1} justifyContent="space-around">
              <StatItem value={stats.posts} label="Posts" />
              <StatItem value={stats.followers} label="Followers" />
              <StatItem value={stats.following} label="Following" />
            </XStack>
          </XStack>

          {/* Name and Bio */}
          <YStack gap={spacing['1']} marginBottom={spacing['4']}>
            <XStack alignItems="center" gap={spacing['2']}>
              <Text fontSize={16} fontWeight="600" color="$color">
                {user?.name || 'Demo User'}
              </Text>
              <XStack
                backgroundColor={`${userCause.color}20`}
                paddingHorizontal={spacing['2']}
                paddingVertical={2}
                borderRadius={8}
                alignItems="center"
                gap={4}
              >
                <Text fontSize={12}>{userCause.icon}</Text>
                <Text fontSize={11} color={userCause.color} fontWeight="600">
                  {userCause.shortName}
                </Text>
              </XStack>
            </XStack>
            <Text fontSize={14} color="$colorPress">
              Creating positive vibes ✨ | Spreading good energy
            </Text>
          </YStack>

          {/* Karma Badge */}
          <XStack
            backgroundColor={`${colors.karma}15`}
            paddingHorizontal={spacing['4']}
            paddingVertical={spacing['3']}
            borderRadius={12}
            alignItems="center"
            justifyContent="space-between"
            marginBottom={spacing['4']}
          >
            <XStack alignItems="center" gap={spacing['2']}>
              <Sparkles size={20} color={colors.karma} />
              <Text fontWeight="600" color="$color">Karma</Text>
            </XStack>
            <Text fontSize={24} fontWeight="700" color={colors.karma}>
              {user?.karma || 67}
            </Text>
          </XStack>

          {/* Action Buttons */}
          <XStack gap={spacing['3']}>
            <Button
              flex={1}
              size="$4"
              backgroundColor="$backgroundHover"
              borderRadius={10}
              fontWeight="600"
              accessibilityLabel="Edit profile"
            >
              Edit Profile
            </Button>
            <Button
              flex={1}
              size="$4"
              backgroundColor="$backgroundHover"
              borderRadius={10}
              fontWeight="600"
              accessibilityLabel="Share profile"
            >
              Share Profile
            </Button>
          </XStack>
        </YStack>
      </MotiView>

      {/* Tabs */}
      <XStack borderBottomWidth={1} borderBottomColor="$borderColor">
        <Button
          flex={1}
          backgroundColor="transparent"
          borderBottomWidth={2}
          borderBottomColor={colors.primary}
          borderRadius={0}
          paddingVertical={spacing['3']}
          icon={<Grid size={20} color={colors.primary} />}
          accessibilityLabel="Posts grid"
        />
        <Button
          flex={1}
          backgroundColor="transparent"
          borderRadius={0}
          paddingVertical={spacing['3']}
          icon={<Bookmark size={20} color={colors.light.textSecondary} />}
          accessibilityLabel="Saved posts"
        />
      </XStack>

      {/* Posts Grid */}
      <XStack flexWrap="wrap" paddingHorizontal={spacing['4']} paddingTop={spacing['1']}>
        {mockPosts.slice(0, 9).map((post, index) => (
          <MotiView
            key={post.id}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 200, delay: index * 50 }}
            style={{ margin: spacing['0.5'] }}
          >
            <Image
              source={{ uri: post.mediaUrl }}
              width={GRID_SIZE}
              height={GRID_SIZE}
              borderRadius={4}
            />
          </MotiView>
        ))}
      </XStack>

      {/* Logout Button (for demo) */}
      <YStack paddingHorizontal={spacing['4']} marginTop={spacing['8']}>
        <Button
          size="$4"
          backgroundColor={colors.semantic.errorLight}
          color={colors.semantic.error}
          fontWeight="600"
          borderRadius={10}
          onPress={handleLogout}
          accessibilityLabel="Log out"
        >
          Log Out
        </Button>
      </YStack>
    </ScrollView>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  const formatValue = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <YStack alignItems="center">
      <Text fontSize={20} fontWeight="700" color="$color">
        {formatValue(value)}
      </Text>
      <Text fontSize={13} color="$colorPress">
        {label}
      </Text>
    </YStack>
  );
}
