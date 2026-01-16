import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme } from 'tamagui';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import config from '../tamagui.config';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load Inter font
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@tamagui/font-inter/otf/Inter-Regular.otf'),
    'Inter-Medium': require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    'Inter-SemiBold': require('@tamagui/font-inter/otf/Inter-SemiBold.otf'),
    'Inter-Bold': require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    'Inter-Black': require('@tamagui/font-inter/otf/Inter-Black.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <TamaguiProvider config={config} defaultTheme={colorScheme ?? 'light'}>
            <Theme name={colorScheme ?? 'light'}>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </Theme>
          </TamaguiProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
