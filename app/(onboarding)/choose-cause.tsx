import { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors, CauseCode } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { causes, Cause } from '../../data/causes';

/**
 * Choose Your Cause Screen
 * User selects which charity cause they want to support
 */
export default function ChooseCauseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useAuthStore();

  const [selectedCause, setSelectedCause] = useState<CauseCode | null>(null);

  const handleSelect = useCallback((code: CauseCode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCause(code);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedCause) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      updateUser({ cause: selectedCause });
      router.push('/(onboarding)/follow-people');
    }
  }, [selectedCause, updateUser, router]);

  const causeList = Object.values(causes);

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + spacing['4']}
      paddingBottom={insets.bottom + spacing['4']}
    >
      {/* Header */}
      <YStack paddingHorizontal={spacing['6']} marginBottom={spacing['6']}>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text fontSize={28} fontWeight="700" color="$color" marginBottom={spacing['2']}>
            Choose Your Cause
          </Text>
          <Text fontSize={16} color="$colorPress">
            Your engagement will support this charity. You can change this anytime.
          </Text>
        </MotiView>
      </YStack>

      {/* Causes List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing['4'],
          paddingBottom: spacing['4'],
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack gap={spacing['3']}>
          {causeList.map((cause, index) => (
            <MotiView
              key={cause.code}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 300, delay: index * 80 }}
            >
              <CauseCard
                cause={cause}
                isSelected={selectedCause === cause.code}
                onSelect={() => handleSelect(cause.code)}
              />
            </MotiView>
          ))}
        </YStack>
      </ScrollView>

      {/* Continue Button */}
      <YStack paddingHorizontal={spacing['6']} paddingTop={spacing['4']}>
        <Button
          size="$5"
          backgroundColor={selectedCause ? colors.primary : colors.light.border}
          color={selectedCause ? 'white' : colors.light.textSecondary}
          fontWeight="600"
          borderRadius={16}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
          disabled={!selectedCause}
          onPress={handleContinue}
          accessibilityLabel="Continue to next step"
        >
          Continue
        </Button>
      </YStack>
    </YStack>
  );
}

function CauseCard({
  cause,
  isSelected,
  onSelect,
}: {
  cause: Cause;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Button
      backgroundColor={isSelected ? `${cause.color}15` : '$backgroundHover'}
      borderWidth={2}
      borderColor={isSelected ? cause.color : 'transparent'}
      borderRadius={16}
      padding={spacing['4']}
      height="auto"
      pressStyle={{ scale: 0.98 }}
      onPress={onSelect}
      accessibilityLabel={`Select ${cause.name}`}
      accessibilityState={{ selected: isSelected }}
    >
      <XStack alignItems="center" gap={spacing['3']} width="100%">
        {/* Icon */}
        <YStack
          width={56}
          height={56}
          borderRadius={14}
          backgroundColor={`${cause.color}20`}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={28}>{cause.icon}</Text>
        </YStack>

        {/* Content */}
        <YStack flex={1} gap={spacing['1']}>
          <Text fontSize={16} fontWeight="600" color="$color">
            {cause.name}
          </Text>
          <Text fontSize={13} color="$colorPress" numberOfLines={2}>
            {cause.impact}
          </Text>
        </YStack>

        {/* Selection Indicator */}
        <AnimatePresence>
          {isSelected && (
            <MotiView
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <YStack
                width={28}
                height={28}
                borderRadius={14}
                backgroundColor={cause.color}
                alignItems="center"
                justifyContent="center"
              >
                <Check size={16} color="white" />
              </YStack>
            </MotiView>
          )}
        </AnimatePresence>
      </XStack>
    </Button>
  );
}
