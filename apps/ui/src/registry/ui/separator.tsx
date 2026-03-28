import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type SeparatorVariant = 'hairline' | 'pixel' | 'cell' | 'section';

type SeparatorProps = React.ComponentPropsWithRef<typeof View> & {
  orientation?: 'horizontal' | 'vertical';
  variant?: SeparatorVariant;
};

const thicknessMap: Record<SeparatorVariant, number> = {
  hairline: StyleSheet.hairlineWidth,
  pixel: 1,
  cell: 2,
  section: 4,
};

function Separator({
  orientation = 'horizontal',
  variant = 'pixel',
  style,
  ...restProps
}: SeparatorProps) {
  const thickness = thicknessMap[variant];

  const width = orientation === 'horizontal' ? '100%' : thickness;
  const height = orientation === 'horizontal' ? thickness : '100%';

  return (
    <View style={[styles.separator, { width, height }, style]} {...restProps} />
  );
}

const styles = StyleSheet.create(({ colors }) => ({
  separator: {
    backgroundColor: colors.borderSubtle,
  },
}));

export { Separator };
export type { SeparatorProps };
