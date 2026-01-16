import { useState, useCallback, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { YStack, XStack, Text, Button, Input, Spinner, Progress } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Eye, EyeOff, Check } from '@tamagui/lucide-icons';

import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

type SignupStep = 'email' | 'password' | 'name';

/**
 * Signup Screen
 * 3-step signup flow with progress indicator
 */
export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signup, isLoading } = useAuthStore();

  const [step, setStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const passwordRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

  const steps: SignupStep[] = ['email', 'password', 'name'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleNext = useCallback(async () => {
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step === 'email') {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      setStep('password');
      setTimeout(() => passwordRef.current?.focus(), 100);
    } else if (step === 'password') {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      setStep('name');
      setTimeout(() => nameRef.current?.focus(), 100);
    } else if (step === 'name') {
      if (name.trim().length < 2) {
        setError('Please enter your name');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      try {
        await signup(email, password, name);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/(auth)/otp');
      } catch (e) {
        setError('Something went wrong. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [step, email, password, name, signup, router]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'email') {
      router.back();
    } else if (step === 'password') {
      setStep('email');
    } else if (step === 'name') {
      setStep('password');
    }
  }, [step, router]);

  const getStepContent = () => {
    switch (step) {
      case 'email':
        return {
          title: "What's your email?",
          subtitle: "We'll send you a verification code",
          placeholder: 'your@email.com',
          value: email,
          onChange: setEmail,
          keyboardType: 'email-address' as const,
          autoComplete: 'email' as const,
        };
      case 'password':
        return {
          title: 'Create a password',
          subtitle: 'Must be at least 8 characters',
          placeholder: 'Enter a strong password',
          value: password,
          onChange: setPassword,
          secureTextEntry: !showPassword,
        };
      case 'name':
        return {
          title: "What's your name?",
          subtitle: "This is how you'll appear to others",
          placeholder: 'Your name',
          value: name,
          onChange: setName,
          autoComplete: 'name' as const,
        };
    }
  };

  const content = getStepContent();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingTop={insets.top}
        paddingBottom={insets.bottom + spacing['4']}
        paddingHorizontal={spacing['6']}
      >
        {/* Header */}
        <XStack alignItems="center" paddingVertical={spacing['4']}>
          <Button
            size="$4"
            circular
            backgroundColor="transparent"
            icon={<ChevronLeft size={24} color={colors.light.text} />}
            onPress={handleBack}
            accessibilityLabel="Go back"
          />
          <YStack flex={1} paddingHorizontal={spacing['4']}>
            <Progress value={progress} backgroundColor="$borderColor">
              <Progress.Indicator backgroundColor={colors.primary} />
            </Progress>
          </YStack>
          <Text color="$colorPress" fontSize={14}>
            {currentStepIndex + 1}/{steps.length}
          </Text>
        </XStack>

        {/* Content */}
        <MotiView
          key={step}
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -20 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.content}
        >
          <YStack gap={spacing['2']} marginBottom={spacing['8']} marginTop={spacing['8']}>
            <Text fontSize={28} fontWeight="700" color="$color">
              {content.title}
            </Text>
            <Text fontSize={16} color="$colorPress">
              {content.subtitle}
            </Text>
          </YStack>

          {/* Input */}
          <YStack gap={spacing['4']}>
            <XStack alignItems="center">
              <Input
                ref={step === 'password' ? passwordRef : step === 'name' ? nameRef : undefined}
                flex={1}
                size="$5"
                placeholder={content.placeholder}
                value={content.value}
                onChangeText={content.onChange}
                keyboardType={content.keyboardType}
                autoComplete={content.autoComplete}
                secureTextEntry={content.secureTextEntry}
                autoCapitalize={step === 'email' || step === 'password' ? 'none' : 'words'}
                autoFocus
                borderRadius={12}
                backgroundColor="$backgroundHover"
                borderWidth={1}
                borderColor="$borderColor"
                focusStyle={{ borderColor: colors.primary }}
                onSubmitEditing={handleNext}
                accessibilityLabel={content.title}
              />
              {step === 'password' && (
                <Button
                  position="absolute"
                  right={8}
                  size="$3"
                  circular
                  backgroundColor="transparent"
                  icon={
                    showPassword ? (
                      <EyeOff size={20} color={colors.light.textSecondary} />
                    ) : (
                      <Eye size={20} color={colors.light.textSecondary} />
                    )
                  }
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                />
              )}
            </XStack>

            {/* Password Requirements */}
            {step === 'password' && (
              <XStack alignItems="center" gap={spacing['2']}>
                <YStack
                  width={20}
                  height={20}
                  borderRadius={10}
                  backgroundColor={
                    password.length >= 8 ? colors.semantic.success : '$borderColor'
                  }
                  alignItems="center"
                  justifyContent="center"
                >
                  {password.length >= 8 && <Check size={12} color="white" />}
                </YStack>
                <Text
                  fontSize={14}
                  color={password.length >= 8 ? colors.semantic.success : '$colorPress'}
                >
                  At least 8 characters
                </Text>
              </XStack>
            )}

            {/* Error Message */}
            {error && (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Text color={colors.semantic.error} fontSize={14}>
                  {error}
                </Text>
              </MotiView>
            )}
          </YStack>
        </MotiView>

        {/* Continue Button */}
        <YStack>
          <Button
            size="$5"
            backgroundColor={colors.primary}
            color="white"
            fontWeight="600"
            borderRadius={16}
            pressStyle={{ scale: 0.98, opacity: 0.9 }}
            disabled={isLoading}
            onPress={handleNext}
            accessibilityLabel={step === 'name' ? 'Create account' : 'Continue'}
            accessibilityRole="button"
          >
            {isLoading ? (
              <Spinner color="white" />
            ) : step === 'name' ? (
              'Create Account'
            ) : (
              'Continue'
            )}
          </Button>

          {/* Login Link */}
          <XStack justifyContent="center" paddingTop={spacing['6']}>
            <Text color="$colorPress" fontSize={14}>
              Already have an account?{' '}
            </Text>
            <Button
              backgroundColor="transparent"
              color={colors.primary}
              fontSize={14}
              fontWeight="600"
              paddingHorizontal={0}
              onPress={() => router.replace('/(auth)/login')}
              accessibilityLabel="Log in"
            >
              Log in
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
