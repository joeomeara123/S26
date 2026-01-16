import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Camera, Image, Video, FileText, Smile } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing, shadows } from '../../constants/spacing';

/**
 * Create Post Screen
 * Entry point for creating new content
 * Note: Full implementation in Week 7
 */
export default function CreateScreen() {
  const insets = useSafeAreaInsets();

  const handleOption = useCallback((option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to creation flow
  }, []);

  const options = [
    { id: 'photo', icon: Image, label: 'Photo', color: colors.primary },
    { id: 'video', icon: Video, label: 'Video', color: colors.semantic.error },
    { id: 'camera', icon: Camera, label: 'Camera', color: colors.karma },
    { id: 'story', icon: Smile, label: 'Story', color: colors.supernova },
    { id: 'text', icon: FileText, label: 'Text Post', color: colors.feelGood },
  ];

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + spacing['4']}
      paddingBottom={insets.bottom}
      paddingHorizontal={spacing['6']}
    >
      {/* Header */}
      <Text fontSize={28} fontWeight="700" color="$color" marginBottom={spacing['8']}>
        Create
      </Text>

      {/* Options Grid */}
      <YStack gap={spacing['4']}>
        {options.map((option, index) => (
          <MotiView
            key={option.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: index * 100 }}
          >
            <Button
              size="$6"
              backgroundColor="$backgroundHover"
              borderRadius={16}
              justifyContent="flex-start"
              paddingHorizontal={spacing['4']}
              pressStyle={{ scale: 0.98, backgroundColor: '$backgroundPress' }}
              onPress={() => handleOption(option.id)}
              accessibilityLabel={`Create ${option.label}`}
            >
              <XStack alignItems="center" gap={spacing['4']} flex={1}>
                <YStack
                  width={48}
                  height={48}
                  borderRadius={12}
                  backgroundColor={`${option.color}20`}
                  alignItems="center"
                  justifyContent="center"
                >
                  <option.icon size={24} color={option.color} />
                </YStack>
                <Text fontSize={18} fontWeight="600" color="$color">
                  {option.label}
                </Text>
              </XStack>
            </Button>
          </MotiView>
        ))}
      </YStack>

      {/* Coming Soon Note */}
      <YStack flex={1} justifyContent="center" alignItems="center">
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 600 }}
        >
          <YStack alignItems="center" gap={spacing['2']}>
            <Text fontSize={40}>📸</Text>
            <Text color="$colorPress" fontSize={14} textAlign="center">
              Full post creation with image cropping{'\n'}and carousel coming in Week 7
            </Text>
          </YStack>
        </MotiView>
      </YStack>
    </YStack>
  );
}
