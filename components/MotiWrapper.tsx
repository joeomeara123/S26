import React from 'react';
import { View, ViewProps, Text, TextProps } from 'react-native';

// Temporary wrapper that uses basic View/Text when Moti/worklets fails
// This allows us to see the UI while we fix native module issues

interface MotiViewProps extends ViewProps {
  from?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  delay?: number;
  children?: React.ReactNode;
}

interface MotiTextProps extends TextProps {
  from?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  delay?: number;
  children?: React.ReactNode;
}

// Export a simple View that ignores Moti props
export const MotiView: React.FC<MotiViewProps> = ({
  from,
  animate,
  exit,
  transition,
  delay,
  style,
  children,
  ...props
}) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

// Export a simple Text that ignores Moti props
export const MotiText: React.FC<MotiTextProps> = ({
  from,
  animate,
  exit,
  transition,
  delay,
  style,
  children,
  ...props
}) => {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};

// AnimatePresence just renders children
export const AnimatePresence: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default MotiView;
