import { useState, useCallback } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, Avatar } from 'tamagui';
import { Heart, MessageCircle, Share2, Star, Music, Plus } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { mockUsers } from '../../data/users';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Video Feed Screen
 * TikTok-style vertical video swipe experience
 * Note: Full video implementation in Week 5
 */
export default function VideoFeedScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Placeholder video data
  const videos = [
    { id: '1', authorId: 'user_1', description: 'Morning yoga flow 🧘‍♀️', likes: 12340, comments: 234 },
    { id: '2', authorId: 'user_2', description: 'Quick workout motivation 💪', likes: 45600, comments: 890 },
    { id: '3', authorId: 'user_4', description: 'Wildlife rescue story 🐕', likes: 78900, comments: 1234 },
  ];

  const currentVideo = videos[currentIndex];
  const author = mockUsers.find((u) => u.id === currentVideo.authorId) || mockUsers[0];

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleSupernova = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <YStack flex={1} backgroundColor="black">
      <StatusBar barStyle="light-content" />

      {/* Video Placeholder */}
      <YStack flex={1} justifyContent="center" alignItems="center">
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />

        {/* Coming Soon Message */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <YStack alignItems="center" gap={spacing['4']}>
            <Text fontSize={60}>🎬</Text>
            <Text color="white" fontSize={24} fontWeight="700" textAlign="center">
              Video Feed
            </Text>
            <Text color="rgba(255,255,255,0.7)" fontSize={16} textAlign="center" paddingHorizontal={spacing['8']}>
              Full TikTok-style video experience{'\n'}coming in Week 5
            </Text>
          </YStack>
        </MotiView>
      </YStack>

      {/* Bottom Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 300,
        }}
      />

      {/* Right Side Actions */}
      <YStack
        position="absolute"
        right={spacing['4']}
        bottom={insets.bottom + 100}
        gap={spacing['6']}
        alignItems="center"
      >
        {/* Profile */}
        <YStack alignItems="center">
          <Avatar circular size="$5" borderWidth={2} borderColor="white">
            <Avatar.Image src={author.avatar} />
            <Avatar.Fallback backgroundColor={colors.primary}>
              <Text color="white" fontWeight="600">{author.name.charAt(0)}</Text>
            </Avatar.Fallback>
          </Avatar>
          <YStack
            position="absolute"
            bottom={-8}
            backgroundColor={colors.primary}
            width={20}
            height={20}
            borderRadius={10}
            alignItems="center"
            justifyContent="center"
          >
            <Plus size={14} color="white" />
          </YStack>
        </YStack>

        {/* Like */}
        <Button
          size="$5"
          circular
          backgroundColor="transparent"
          onPress={handleLike}
          accessibilityLabel="Like video"
        >
          <YStack alignItems="center" gap={4}>
            <Heart size={32} color="white" />
            <Text color="white" fontSize={12} fontWeight="600">
              {(currentVideo.likes / 1000).toFixed(1)}K
            </Text>
          </YStack>
        </Button>

        {/* Comments */}
        <Button
          size="$5"
          circular
          backgroundColor="transparent"
          accessibilityLabel="View comments"
        >
          <YStack alignItems="center" gap={4}>
            <MessageCircle size={32} color="white" />
            <Text color="white" fontSize={12} fontWeight="600">
              {currentVideo.comments}
            </Text>
          </YStack>
        </Button>

        {/* Share */}
        <Button
          size="$5"
          circular
          backgroundColor="transparent"
          accessibilityLabel="Share video"
        >
          <YStack alignItems="center" gap={4}>
            <Share2 size={32} color="white" />
            <Text color="white" fontSize={12} fontWeight="600">
              Share
            </Text>
          </YStack>
        </Button>

        {/* Supernova */}
        <Button
          size="$5"
          circular
          backgroundColor={colors.supernova}
          onPress={handleSupernova}
          accessibilityLabel="Give Supernova"
        >
          <Star size={28} color="white" fill="white" />
        </Button>
      </YStack>

      {/* Bottom Info */}
      <YStack
        position="absolute"
        left={spacing['4']}
        right={80}
        bottom={insets.bottom + 20}
      >
        {/* Username */}
        <XStack alignItems="center" gap={spacing['2']} marginBottom={spacing['2']}>
          <Text color="white" fontWeight="700" fontSize={16}>
            @{author.username}
          </Text>
          {author.isVerified && <Text>✓</Text>}
        </XStack>

        {/* Description */}
        <Text color="white" fontSize={14} numberOfLines={2}>
          {currentVideo.description}
        </Text>

        {/* Sound */}
        <XStack alignItems="center" gap={spacing['2']} marginTop={spacing['3']}>
          <Music size={14} color="white" />
          <Text color="white" fontSize={12}>
            Original audio - {author.username}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
