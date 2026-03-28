import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Color } from '@/styles/tokens/colors';
import { TextVariants } from '@/styles/tokens/typography';

type TextProps = React.ComponentPropsWithRef<typeof RNText> & {
  color?: Color;
  variant?: keyof TextVariants;
  fontWeight?: TextStyle['fontWeight'];
  letterSpacing?: TextStyle['letterSpacing'];
  textAlign?: TextStyle['textAlign'];
  textTransform?: TextStyle['textTransform'];
};

function Text({
  color = 'foreground',
  variant = 'bodyMd',
  fontWeight,
  letterSpacing,
  textAlign,
  textTransform,
  style,
  ...restProps
}: TextProps) {
  const overrideStyle: TextStyle = {};

  if (fontWeight) {
    overrideStyle.fontWeight = fontWeight;
  }
  if (letterSpacing) {
    overrideStyle.letterSpacing = letterSpacing;
  }
  if (textAlign) {
    overrideStyle.textAlign = textAlign;
  }
  if (textTransform) {
    overrideStyle.textTransform = textTransform;
  }

  return (
    <RNText
      style={[
        styles.text({
          color,
          variant,
        }),
        overrideStyle,
        style,
      ]}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create(({ colors, typography }) => ({
  text: ({
    color,
    variant,
  }: {
    color: Color;
    variant: keyof TextVariants;
  }) => ({
    color: colors[`${color}`],
    ...typography.variants[variant],
  }),
}));

export { Text };
export type { TextProps };
