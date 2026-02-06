import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  blurIntensity?: number;
}

export function GlassCard({
  children,
  style,
  blurIntensity = colors.auth.glassBlur,
}: GlassCardProps) {
  return (
    <View style={[styles.outer, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
  },
  inner: {
    padding: 24,
  },
});
