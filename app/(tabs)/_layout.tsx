import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Video, PlusCircle, Sparkles, User } from '@tamagui/lucide-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '../../constants/colors';
import { layout } from '../../constants/spacing';

/**
 * Main App Tab Navigator
 * 5 tabs: Home, Video Feed, Create, Karma, Profile
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.light.textSecondary,
        tabBarStyle: {
          height: layout.tabBarHeight + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
          borderTopWidth: 1,
          borderTopColor: colors.light.border,
          backgroundColor: colors.light.background,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={layout.tabBarIconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="video-feed"
        options={{
          title: 'Videos',
          tabBarIcon: ({ color, focused }) => (
            <Video size={layout.tabBarIconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle
              size={layout.tabBarIconSize + 4}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="karma"
        options={{
          title: 'Karma',
          tabBarIcon: ({ color, focused }) => (
            <Sparkles
              size={layout.tabBarIconSize}
              color={focused ? colors.karma : color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User size={layout.tabBarIconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
