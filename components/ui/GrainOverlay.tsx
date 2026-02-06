import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

const grainTexture = require('../../assets/textures/grain.png');

interface GrainOverlayProps {
  opacity?: number;
  style?: ViewStyle;
}

export function GrainOverlay({
  opacity = colors.auth.grainOpacity,
  style,
}: GrainOverlayProps) {
  return (
    <View style={[styles.container, { opacity }, style]} pointerEvents="none">
      <Image
        source={grainTexture}
        style={styles.grain}
        resizeMode="repeat"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  grain: {
    width: '100%',
    height: '100%',
  },
});
