import { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Avatar, Progress } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { mockUsers, User } from '../../data/users';
import { causes } from '../../data/causes';

const MIN_FOLLOWS = 5; // Lowered for demo purposes (originally 30)

/**
 * Follow People Screen
 * User must follow minimum number of people before continuing
 */
export default function FollowPeopleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();

  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

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
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + spacing['4']}
      paddingBottom={insets.bottom + spacing['4']}
    >
      {/* Header */}
      <YStack paddingHorizontal={spacing['6']} marginBottom={spacing['4']}>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text fontSize={28} fontWeight="700" color="$color" marginBottom={spacing['2']}>
            Follow Creators
          </Text>
          <Text fontSize={16} color="$colorPress">
            Follow at least {MIN_FOLLOWS} creators to build your personalized feed.
          </Text>
        </MotiView>
      </YStack>

      {/* Progress Bar */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
      >
        <YStack paddingHorizontal={spacing['6']} marginBottom={spacing['6']}>
          <XStack justifyContent="space-between" marginBottom={spacing['2']}>
            <Text fontSize={14} fontWeight="600" color="$color">
              {followCount} / {MIN_FOLLOWS} following
            </Text>
            <Text fontSize={14} color={canContinue ? colors.semantic.success : '$colorPress'}>
              {canContinue ? '✓ Ready!' : `${MIN_FOLLOWS - followCount} more`}
            </Text>
          </XStack>
          <Progress value={progress} backgroundColor="$borderColor" height={8} borderRadius={4}>
            <Progress.Indicator backgroundColor={canContinue ? colors.semantic.success : colors.primary} />
          </Progress>
        </YStack>
      </MotiView>

      {/* Users List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing['4'],
          paddingBottom: spacing['4'],
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack gap={spacing['3']}>
          {mockUsers.map((user, index) => (
            <MotiView
              key={user.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 250, delay: index * 60 }}
            >
              <UserCard
                user={user}
                isFollowing={followedIds.has(user.id)}
                onToggleFollow={() => handleFollow(user.id)}
              />
            </MotiView>
          ))}
        </YStack>
      </ScrollView>

      {/* Continue Button */}
      <YStack paddingHorizontal={spacing['6']} paddingTop={spacing['4']}>
        <Button
          size="$5"
          backgroundColor={canContinue ? colors.primary : colors.light.border}
          color={canContinue ? 'white' : colors.light.textSecondary}
          fontWeight="600"
          borderRadius={16}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
          disabled={!canContinue}
          onPress={handleContinue}
          accessibilityLabel="Start using Supernova"
        >
          {canContinue ? "Let's Go!" : `Follow ${MIN_FOLLOWS - followCount} more`}
        </Button>
      </YStack>
    </YStack>
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
    <XStack
      backgroundColor="$backgroundHover"
      borderRadius={16}
      padding={spacing['4']}
      alignItems="center"
      gap={spacing['3']}
    >
      {/* Avatar */}
      <Avatar circular size="$5">
        <Avatar.Image src={user.avatar} />
        <Avatar.Fallback backgroundColor={colors.primary}>
          <Text color="white" fontWeight="600">{user.name.charAt(0)}</Text>
        </Avatar.Fallback>
      </Avatar>

      {/* Info */}
      <YStack flex={1} gap={2}>
        <XStack alignItems="center" gap={spacing['1']}>
          <Text fontSize={16} fontWeight="600" color="$color">
            {user.name}
          </Text>
          {user.isVerified && (
            <YStack
              width={16}
              height={16}
              borderRadius={8}
              backgroundColor={colors.primary}
              alignItems="center"
              justifyContent="center"
            >
              <Check size={10} color="white" />
            </YStack>
          )}
        </XStack>
        <Text fontSize={13} color="$colorPress">
          @{user.username}
        </Text>
        <XStack alignItems="center" gap={4} marginTop={2}>
          <Text fontSize={12}>{userCause?.icon}</Text>
          <Text fontSize={11} color={userCause?.color} fontWeight="500">
            {userCause?.shortName}
          </Text>
          <Text fontSize={11} color="$colorPress">
            • {(user.followers / 1000).toFixed(1)}K followers
          </Text>
        </XStack>
      </YStack>

      {/* Follow Button */}
      <Button
        size="$3"
        backgroundColor={isFollowing ? colors.light.background : colors.primary}
        borderWidth={isFollowing ? 1 : 0}
        borderColor="$borderColor"
        borderRadius={10}
        paddingHorizontal={spacing['4']}
        onPress={onToggleFollow}
        accessibilityLabel={isFollowing ? `Unfollow ${user.name}` : `Follow ${user.name}`}
      >
        <Text
          fontSize={13}
          fontWeight="600"
          color={isFollowing ? '$color' : 'white'}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </Button>
    </XStack>
  );
}
