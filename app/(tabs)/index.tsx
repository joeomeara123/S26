import { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Avatar, Image } from 'tamagui';
import { Bell, MessageCircle, Heart, MessageSquare, Share2, Star } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing, layout, shadows } from '../../constants/spacing';
import { mockPosts, Post } from '../../data/posts';
import { mockUsers } from '../../data/users';

/**
 * Home Feed Screen
 * Main timeline with posts from followed users
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderHeader = () => (
    <XStack
      paddingHorizontal={spacing['4']}
      paddingVertical={spacing['3']}
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="$background"
    >
      <Text fontSize={28} fontWeight="700" color="$color">
        Supernova
      </Text>
      <XStack gap={spacing['2']}>
        <Button
          size="$4"
          circular
          backgroundColor="transparent"
          icon={<MessageCircle size={24} color={colors.light.text} />}
          accessibilityLabel="Messages"
        />
        <Button
          size="$4"
          circular
          backgroundColor="transparent"
          icon={<Bell size={24} color={colors.light.text} />}
          accessibilityLabel="Notifications"
        />
      </XStack>
    </XStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300, delay: index * 50 }}
          >
            <PostCard post={item} />
          </MotiView>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </YStack>
  );
}

import React from 'react';

function PostCard({ post }: { post: Post }) {
  const author = mockUsers.find((u) => u.id === post.authorId) || mockUsers[0];
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes);

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  }, [liked]);

  const handleSupernova = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Supernova animation
  }, []);

  return (
    <YStack
      backgroundColor="$background"
      marginBottom={spacing['2']}
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      {/* Header */}
      <XStack
        paddingHorizontal={spacing['4']}
        paddingVertical={spacing['3']}
        alignItems="center"
        gap={spacing['3']}
      >
        <Avatar circular size="$4">
          <Avatar.Image src={author.avatar} />
          <Avatar.Fallback backgroundColor={colors.primary}>
            <Text color="white" fontWeight="600">
              {author.name.charAt(0)}
            </Text>
          </Avatar.Fallback>
        </Avatar>
        <YStack flex={1}>
          <Text fontWeight="600" color="$color">
            {author.username}
          </Text>
          <Text fontSize={12} color="$colorPress">
            {post.timestamp}
          </Text>
        </YStack>
        {post.isFeelGood && (
          <XStack
            backgroundColor={colors.feelGoodLight}
            paddingHorizontal={spacing['2']}
            paddingVertical={spacing['1']}
            borderRadius={12}
            alignItems="center"
            gap={4}
          >
            <Text fontSize={12}>✨</Text>
            <Text fontSize={11} color={colors.feelGoodDark} fontWeight="600">
              Feel Good
            </Text>
          </XStack>
        )}
      </XStack>

      {/* Media */}
      {post.mediaUrl && (
        <Image
          source={{ uri: post.mediaUrl }}
          width="100%"
          height={400}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <XStack
        paddingHorizontal={spacing['4']}
        paddingVertical={spacing['3']}
        gap={spacing['4']}
        alignItems="center"
      >
        <Button
          size="$3"
          backgroundColor="transparent"
          paddingHorizontal={0}
          onPress={handleLike}
          icon={
            <Heart
              size={24}
              color={liked ? colors.semantic.error : colors.light.text}
              fill={liked ? colors.semantic.error : 'transparent'}
            />
          }
          accessibilityLabel={liked ? 'Unlike' : 'Like'}
        >
          <Text color={liked ? colors.semantic.error : '$color'} fontWeight="500">
            {likeCount}
          </Text>
        </Button>
        <Button
          size="$3"
          backgroundColor="transparent"
          paddingHorizontal={0}
          icon={<MessageSquare size={24} color={colors.light.text} />}
          accessibilityLabel="Comment"
        >
          <Text color="$color" fontWeight="500">
            {post.comments}
          </Text>
        </Button>
        <Button
          size="$3"
          backgroundColor="transparent"
          paddingHorizontal={0}
          icon={<Share2 size={24} color={colors.light.text} />}
          accessibilityLabel="Share"
        />
        <YStack flex={1} />
        <Button
          size="$4"
          backgroundColor={colors.supernovaGlow}
          borderRadius={20}
          paddingHorizontal={spacing['3']}
          onPress={handleSupernova}
          accessibilityLabel="Give Supernova"
        >
          <XStack alignItems="center" gap={4}>
            <Star size={16} color={colors.supernovaDark} fill={colors.supernovaDark} />
            <Text color={colors.supernovaDark} fontWeight="600" fontSize={13}>
              Supernova
            </Text>
          </XStack>
        </Button>
      </XStack>

      {/* Caption */}
      {post.caption && (
        <YStack paddingHorizontal={spacing['4']} paddingBottom={spacing['3']}>
          <Text color="$color">
            <Text fontWeight="600">{author.username} </Text>
            {post.caption}
          </Text>
        </YStack>
      )}
    </YStack>
  );
}
