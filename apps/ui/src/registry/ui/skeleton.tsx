import React from 'react';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { DimensionValue } from 'react-native';

import { Radius } from '@/styles/tokens/radius';

const animConfig = {
  duration: 800,
  easing: Easing.inOut(Easing.ease),
};

type SkeletonProps = React.ComponentPropsWithRef<typeof Animated.View> & {
  /**
   * Duration (in milliseconds) before the animation starts.
   * @default 0
   */
  delayMs?: number;
  /**
   * Disable the opacity animation.
   * Useful for static skeletons that do not require animation.
   * @default false
   */
  disableAnimation?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: keyof Radius;
};

function Skeleton({
  delayMs = 0,
  disableAnimation = false,
  width = '100%',
  height = 48,
  radius = 'md',
  style,
  ...restProps
}: SkeletonProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: disableAnimation
      ? 1
      : withDelay(
          delayMs,
          withRepeat(
            withSequence(
              withTiming(1, animConfig),
              withTiming(0.4, animConfig),
            ),
            -1,
            true,
          ),
        ),
  }));

  return (
    <Animated.View
      style={[
        styles.container(radius),
        {
          width,
          height,
        },
        animatedStyle,
        style,
      ]}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create(({ colors, radius }) => ({
  container: (radiusKey: keyof Radius) => ({
    backgroundColor: colors.muted,
    borderRadius: radius[radiusKey],
    borderCurve: 'continuous',
  }),
}));

export { Skeleton };
export type { SkeletonProps };
