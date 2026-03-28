import React from 'react';
import VectorIcons from '@react-native-vector-icons/lucide';
import { withUnistyles } from 'react-native-unistyles';

import { Color } from '@/styles/tokens/colors';

const UniVectorIcons = withUnistyles(VectorIcons);

type IconProps = Omit<
  React.ComponentPropsWithRef<typeof VectorIcons>,
  'color'
> & {
  color?: Color;
};

function Icon({ color = 'foreground', size = 16, ...restProps }: IconProps) {
  return (
    <UniVectorIcons
      size={size}
      uniProps={theme => ({ color: theme.colors[color] })}
      {...restProps}
    />
  );
}

export { Icon };
export type { IconProps };
