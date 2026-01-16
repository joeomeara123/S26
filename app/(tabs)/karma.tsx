import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Progress, Card } from 'tamagui';
import { Sparkles, Star, TrendingUp, Heart, Gift } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { spacing, shadows } from '../../constants/spacing';
import { useAuthStore } from '../../store/authStore';
import { causes, formatMoney } from '../../data/causes';

/**
 * Karma Screen
 * Shows karma progress, cause impact, and Supernova store
 * Note: Full implementation in Week 7
 */
export default function KarmaScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const userKarma = user?.karma || 67;
  const selectedCause = user?.cause ? causes[user.cause as keyof typeof causes] : causes.EC;

  const handleGiveSupernova = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.light.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing['4'],
        paddingBottom: insets.bottom + spacing['8'],
        paddingHorizontal: spacing['4'],
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom={spacing['6']}>
        <Text fontSize={28} fontWeight="700" color="$color">
          Karma
        </Text>
        <XStack alignItems="center" gap={spacing['2']}>
          <Sparkles size={20} color={colors.karma} />
          <Text fontSize={24} fontWeight="700" color={colors.karma}>
            {userKarma}
          </Text>
        </XStack>
      </XStack>

      {/* Karma Progress Card */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <Card
          backgroundColor="$backgroundHover"
          borderRadius={20}
          padding={spacing['5']}
          marginBottom={spacing['6']}
          {...shadows.md}
        >
          <YStack gap={spacing['4']}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={18} fontWeight="600" color="$color">
                Your Karma Progress
              </Text>
              <Text fontSize={14} color={colors.karma} fontWeight="600">
                {userKarma}/100
              </Text>
            </XStack>

            {/* Progress Bar */}
            <YStack gap={spacing['2']}>
              <Progress value={userKarma} backgroundColor="$borderColor" height={12} borderRadius={6}>
                <Progress.Indicator backgroundColor={colors.karma} />
              </Progress>
              <XStack justifyContent="space-between">
                <Text fontSize={12} color="$colorPress">Keep engaging!</Text>
                <Text fontSize={12} color="$colorPress">
                  {100 - userKarma} more to Supernova
                </Text>
              </XStack>
            </YStack>

            {/* Give Supernova Button */}
            <Button
              size="$5"
              backgroundColor={userKarma >= 100 ? colors.supernova : colors.light.border}
              color={userKarma >= 100 ? 'white' : colors.light.textSecondary}
              fontWeight="600"
              borderRadius={16}
              disabled={userKarma < 100}
              onPress={handleGiveSupernova}
              icon={<Star size={20} color={userKarma >= 100 ? 'white' : colors.light.textSecondary} />}
              accessibilityLabel="Give Supernova"
            >
              Give a Supernova (100 Karma)
            </Button>
          </YStack>
        </Card>
      </MotiView>

      {/* Your Cause */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 100 }}
      >
        <Card
          backgroundColor={`${selectedCause.color}15`}
          borderRadius={20}
          padding={spacing['5']}
          marginBottom={spacing['6']}
          borderWidth={2}
          borderColor={selectedCause.color}
        >
          <YStack gap={spacing['3']}>
            <XStack alignItems="center" gap={spacing['3']}>
              <Text fontSize={32}>{selectedCause.icon}</Text>
              <YStack flex={1}>
                <Text fontSize={18} fontWeight="600" color="$color">
                  {selectedCause.name}
                </Text>
                <Text fontSize={14} color="$colorPress">
                  Your selected cause
                </Text>
              </YStack>
            </XStack>

            <Text fontSize={14} color="$color">
              {selectedCause.description}
            </Text>

            <XStack gap={spacing['4']} marginTop={spacing['2']}>
              <YStack flex={1}>
                <Text fontSize={20} fontWeight="700" color={selectedCause.color}>
                  {formatMoney(selectedCause.totalRaised)}
                </Text>
                <Text fontSize={12} color="$colorPress">Total Raised</Text>
              </YStack>
              <YStack flex={1}>
                <Text fontSize={20} fontWeight="700" color={selectedCause.color}>
                  {(selectedCause.activeUsers / 1000).toFixed(1)}K
                </Text>
                <Text fontSize={12} color="$colorPress">Supporters</Text>
              </YStack>
            </XStack>
          </YStack>
        </Card>
      </MotiView>

      {/* How to Earn Karma */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
      >
        <Text fontSize={18} fontWeight="600" color="$color" marginBottom={spacing['4']}>
          How to Earn Karma
        </Text>

        <YStack gap={spacing['3']}>
          <KarmaAction icon={Heart} label="Like a post" karma={1} color={colors.semantic.error} />
          <KarmaAction icon={TrendingUp} label="Share content" karma={5} color={colors.primary} />
          <KarmaAction icon={Gift} label="Receive a Supernova" karma={10} color={colors.supernova} />
          <KarmaAction icon={Star} label="Daily login" karma={5} color={colors.karma} />
        </YStack>
      </MotiView>
    </ScrollView>
  );
}

function KarmaAction({
  icon: Icon,
  label,
  karma,
  color,
}: {
  icon: typeof Heart;
  label: string;
  karma: number;
  color: string;
}) {
  return (
    <XStack
      backgroundColor="$backgroundHover"
      borderRadius={12}
      padding={spacing['4']}
      alignItems="center"
      gap={spacing['3']}
    >
      <YStack
        width={40}
        height={40}
        borderRadius={10}
        backgroundColor={`${color}20`}
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={20} color={color} />
      </YStack>
      <Text flex={1} fontSize={16} color="$color">
        {label}
      </Text>
      <XStack alignItems="center" gap={4}>
        <Text fontSize={16} fontWeight="600" color={colors.karma}>
          +{karma}
        </Text>
        <Sparkles size={14} color={colors.karma} />
      </XStack>
    </XStack>
  );
}
