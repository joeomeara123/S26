import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '../../components/MotiWrapper';
import { YStack, XStack, Text, Avatar, Image } from 'tamagui';
import { Bell, MessageCircle, Heart, MessageSquare, Share2, Star, MoreHorizontal, Bookmark } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { mockPosts, Post } from '../../data/posts';
import { mockUsers } from '../../data/users';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Home Feed Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal, native iOS feel (like Twitter/Instagram)
 * - No gradient buttons or heavy shadows
 * - Solid dark accents
 * - Clean story rings with thin borders
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + spacing['2'] }]}>
      <View style={styles.headerContent}>
        {/* Logo - Clean, no gradient */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Star size={18} color="white" fill="white" />
          </View>
          <Text style={styles.logoText}>Supernova</Text>
        </View>

        {/* Actions */}
        <XStack gap={spacing['1']}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
            accessibilityLabel="Messages"
          >
            <MessageCircle size={22} color="#1F2937" />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
            accessibilityLabel="Notifications"
          >
            <Bell size={22} color="#1F2937" />
          </Pressable>
        </XStack>
      </View>

      {/* Stories Row */}
      <View style={styles.storiesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={mockUsers.slice(0, 6)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.storiesList}
          renderItem={({ item, index }) => (
            <StoryAvatar user={item} isFirst={index === 0} />
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
            tintColor="#1F2937"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

// Story avatar component - Clean design
function StoryAvatar({ user, isFirst }: { user: typeof mockUsers[0]; isFirst: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.storyItem,
        pressed && styles.storyItemPressed,
      ]}
    >
      {isFirst ? (
        <View style={styles.addStoryContainer}>
          <Avatar circular size="$6">
            <Avatar.Image src={user.avatar} />
          </Avatar>
          <View style={styles.addStoryButton}>
            <Text style={styles.addStoryIcon}>+</Text>
          </View>
          <Text style={styles.storyUsername}>Your story</Text>
        </View>
      ) : (
        <View style={styles.storyAvatarContainer}>
          {/* Clean ring - solid border instead of gradient */}
          <View style={styles.storyRing}>
            <View style={styles.storyRingInner}>
              <Avatar circular size="$6">
                <Avatar.Image src={user.avatar} />
              </Avatar>
            </View>
          </View>
          <Text style={styles.storyUsername} numberOfLines={1}>
            {user.username.slice(0, 10)}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// Premium post card component - Clean design
function PostCard({ post }: { post: Post }) {
  const author = mockUsers.find((u) => u.id === post.authorId) || mockUsers[0];
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  }, [liked]);

  const handleSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(!saved);
  }, [saved]);

  const handleSupernova = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Pressable style={styles.postAuthor}>
          <Avatar circular size="$4">
            <Avatar.Image src={author.avatar} />
            <Avatar.Fallback backgroundColor="#1F2937">
              <Text style={{ color: 'white', fontWeight: '600' }}>
                {author.name.charAt(0)}
              </Text>
            </Avatar.Fallback>
          </Avatar>
          <View style={styles.authorInfo}>
            <XStack alignItems="center" gap={4}>
              <Text style={styles.authorUsername}>{author.username}</Text>
              {author.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </XStack>
            <Text style={styles.postTime}>{post.timestamp}</Text>
          </View>
        </Pressable>

        <XStack alignItems="center" gap={spacing['2']}>
          {post.isFeelGood && (
            <View style={styles.feelGoodBadge}>
              <Text style={styles.feelGoodText}>Feel Good</Text>
            </View>
          )}
          <Pressable style={styles.moreButton}>
            <MoreHorizontal size={20} color="#6B7280" />
          </Pressable>
        </XStack>
      </View>

      {/* Media */}
      {post.mediaUrl && (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: post.mediaUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <XStack alignItems="center" gap={spacing['4']}>
          {/* Like */}
          <Pressable onPress={handleLike} style={styles.actionButton}>
            <MotiView
              animate={{ scale: liked ? [1, 1.2, 1] : 1 }}
              transition={{ type: 'timing', duration: 200 }}
            >
              <Heart
                size={24}
                color={liked ? '#EF4444' : '#1F2937'}
                fill={liked ? '#EF4444' : 'transparent'}
              />
            </MotiView>
            <Text style={[styles.actionCount, liked && styles.likedCount]}>
              {formatCount(likeCount)}
            </Text>
          </Pressable>

          {/* Comment */}
          <Pressable style={styles.actionButton}>
            <MessageSquare size={24} color="#1F2937" />
            <Text style={styles.actionCount}>{formatCount(post.comments)}</Text>
          </Pressable>

          {/* Share */}
          <Pressable style={styles.actionButton}>
            <Share2 size={22} color="#1F2937" />
          </Pressable>
        </XStack>

        <XStack alignItems="center" gap={spacing['3']}>
          {/* Save */}
          <Pressable onPress={handleSave} style={styles.actionButton}>
            <Bookmark
              size={22}
              color={saved ? '#1F2937' : '#1F2937'}
              fill={saved ? '#1F2937' : 'transparent'}
            />
          </Pressable>

          {/* Supernova Button - Clean solid style */}
          <Pressable
            onPress={handleSupernova}
            style={({ pressed }) => [
              styles.supernovaButton,
              pressed && styles.supernovaButtonPressed,
            ]}
          >
            <Star size={14} color="white" fill="white" />
            <Text style={styles.supernovaText}>Supernova</Text>
          </Pressable>
        </XStack>
      </View>

      {/* Caption */}
      {post.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            <Text style={styles.captionUsername}>{author.username} </Text>
            {post.caption}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['3'],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPressed: {
    backgroundColor: '#F9FAFB',
    transform: [{ scale: 0.96 }],
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  storiesContainer: {
    paddingVertical: spacing['3'],
  },
  storiesList: {
    paddingHorizontal: spacing['4'],
    gap: spacing['3'],
  },
  storyItem: {
    marginRight: spacing['3'],
  },
  storyItemPressed: {
    opacity: 0.8,
  },
  storyAvatarContainer: {
    alignItems: 'center',
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#1F2937',
    padding: 2,
    backgroundColor: '#FAFAFA',
  },
  storyRingInner: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryContainer: {
    alignItems: 'center',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 18,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  addStoryIcon: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginTop: -1,
  },
  storyUsername: {
    marginTop: spacing['1'],
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 64,
  },
  postCard: {
    backgroundColor: '#FAFAFA',
    marginBottom: spacing['2'],
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  authorInfo: {
    gap: 2,
  },
  authorUsername: {
    fontSize: 14,
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
  verifiedIcon: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  feelGoodBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: spacing['2'],
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  feelGoodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  moreButton: {
    padding: spacing['1'],
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  likedCount: {
    color: '#EF4444',
  },
  supernovaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2937',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: 10,
  },
  supernovaButtonPressed: {
    backgroundColor: '#374151',
    transform: [{ scale: 0.96 }],
  },
  supernovaText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  captionContainer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['3'],
  },
  caption: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
});
