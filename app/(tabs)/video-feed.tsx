import { useState, useCallback } from 'react';
import { Dimensions, StatusBar, StyleSheet, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Avatar } from 'tamagui';
import { Heart, MessageCircle, Share2, Star, Music, Plus, Check } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from '../../components/MotiWrapper';
import { LinearGradient } from 'expo-linear-gradient';

import { spacing } from '../../constants/spacing';
import { mockUsers } from '../../data/users';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Video Feed Screen - Production Quality Design
 *
 * Design principles:
 * - Clean, minimal TikTok-style interface
 * - No gradient buttons - solid colors
 * - Dark theme appropriate for video content
 */
export default function VideoFeedScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showSupernovaEffect, setShowSupernovaEffect] = useState(false);

  // Placeholder video data
  const videos = [
    { id: '1', authorId: 'user_1', description: 'Morning yoga flow #wellness #mindfulness', likes: 12340, comments: 234 },
    { id: '2', authorId: 'user_2', description: 'Quick workout motivation #fitness #health', likes: 45600, comments: 890 },
    { id: '3', authorId: 'user_4', description: 'Wildlife rescue story #animals #kindness', likes: 78900, comments: 1234 },
  ];

  const currentVideo = videos[currentIndex];
  const author = mockUsers.find((u) => u.id === currentVideo.authorId) || mockUsers[0];

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLiked(!isLiked);
  }, [isLiked]);

  const handleSupernova = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSupernovaEffect(true);
    setTimeout(() => setShowSupernovaEffect(false), 1500);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Video Placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.darkBackground} />

        {/* Coming Soon Message */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.comingSoonContainer}
        >
          <View style={styles.iconBadge}>
            <Text style={styles.iconEmoji}>🎬</Text>
          </View>
          <Text style={styles.comingSoonTitle}>Video Feed</Text>
          <Text style={styles.comingSoonSubtitle}>
            Full TikTok-style video experience{'\n'}coming in Week 5
          </Text>
        </MotiView>
      </View>

      {/* Bottom Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
        style={styles.bottomGradient}
      />

      {/* Right Side Actions */}
      <View style={[styles.actionsContainer, { bottom: insets.bottom + 100 }]}>
        {/* Profile with Follow Button */}
        <View style={styles.actionItem}>
          <View style={styles.avatarContainer}>
            <Avatar circular size="$5" borderWidth={2} borderColor="white">
              <Avatar.Image src={author.avatar} />
              <Avatar.Fallback backgroundColor="#1F2937">
                <Text style={styles.avatarFallback}>{author.name.charAt(0)}</Text>
              </Avatar.Fallback>
            </Avatar>
            <View style={styles.followBadge}>
              <Plus size={12} color="white" strokeWidth={3} />
            </View>
          </View>
        </View>

        {/* Like Button */}
        <Pressable
          onPress={handleLike}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityLabel="Like video"
        >
          <MotiView
            animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
            transition={{ type: 'timing', duration: 200 }}
          >
            <Heart
              size={32}
              color={isLiked ? '#EF4444' : 'white'}
              fill={isLiked ? '#EF4444' : 'transparent'}
            />
          </MotiView>
          <Text style={styles.actionLabel}>{formatNumber(currentVideo.likes)}</Text>
        </Pressable>

        {/* Comments Button */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityLabel="View comments"
        >
          <MessageCircle size={32} color="white" />
          <Text style={styles.actionLabel}>{formatNumber(currentVideo.comments)}</Text>
        </Pressable>

        {/* Share Button */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityLabel="Share video"
        >
          <Share2 size={32} color="white" />
          <Text style={styles.actionLabel}>Share</Text>
        </Pressable>

        {/* Supernova Button - Clean solid style */}
        <Pressable
          onPress={handleSupernova}
          style={({ pressed }) => [
            styles.supernovaButton,
            pressed && styles.supernovaButtonPressed,
          ]}
          accessibilityLabel="Give Supernova"
        >
          <Star size={26} color="white" fill="white" />
        </Pressable>
      </View>

      {/* Supernova Effect */}
      <AnimatePresence>
        {showSupernovaEffect && (
          <MotiView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ type: 'spring', damping: 10 }}
            style={styles.supernovaEffect}
          >
            <Star size={100} color="white" fill="white" />
          </MotiView>
        )}
      </AnimatePresence>

      {/* Bottom Info */}
      <View style={[styles.bottomInfo, { bottom: insets.bottom + 20 }]}>
        {/* Username */}
        <View style={styles.usernameRow}>
          <Text style={styles.username}>@{author.username}</Text>
          {author.isVerified && (
            <View style={styles.verifiedBadge}>
              <Check size={10} color="white" strokeWidth={3} />
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {currentVideo.description}
        </Text>

        {/* Sound */}
        <View style={styles.soundRow}>
          <View style={styles.soundIconContainer}>
            <Music size={12} color="white" />
          </View>
          <Text style={styles.soundText}>Original audio - {author.username}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a1a',
  },
  comingSoonContainer: {
    alignItems: 'center',
    gap: spacing['4'],
  },
  iconBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  iconEmoji: {
    fontSize: 40,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  comingSoonSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  actionsContainer: {
    position: 'absolute',
    right: spacing['3'],
    gap: spacing['5'],
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarFallback: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  followBadge: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonPressed: {
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
  actionLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  supernovaButton: {
    marginTop: spacing['2'],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supernovaButtonPressed: {
    backgroundColor: '#374151',
    transform: [{ scale: 0.9 }],
  },
  supernovaEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },
  bottomInfo: {
    position: 'absolute',
    left: spacing['4'],
    right: 80,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: spacing['2'],
  },
  username: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing['3'],
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  soundIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundText: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
});
