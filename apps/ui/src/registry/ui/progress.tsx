import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
  clamp,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type ProgressProps = React.ComponentPropsWithRef<typeof View> & {
  height?: number;
} & (
    | {
        value: null;
        min?: number;
        max?: number;
      }
    | {
        // min, max is required by accessibilityValue prop when value is defined
        // see https://reactnative.dev/docs/0.80/accessibility#accessibilityvalue
        value: number;
        min: number;
        max: number;
      }
  );

const indeterminateRangeWidth = 70;

function Progress({
  accessibilityValue,
  value,
  min,
  max,
  height = 8,
  style,
  children,
  ...restProps
}: ProgressProps) {
  const offset = useSharedValue(0);

  const width = useSharedValue(
    value === null
      ? indeterminateRangeWidth
      : getProgressPercentage(value, min, max),
  );

  useEffect(() => {
    if (value === null) {
      offset.value = -indeterminateRangeWidth;
      width.value = indeterminateRangeWidth;
      offset.value = withRepeat(
        withTiming(100, {
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1.2),
        }),
        -1,
        false,
      );
    } else {
      offset.value = 0;
      width.value = withTiming(getProgressPercentage(value, min, max), {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min, max]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: `${offset.value}%`,
      width: `${width.value}%`,
    };
  });

  return (
    <View
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{
        ...accessibilityValue,
        min,
        max,
        now: value === null ? undefined : clamp(value, min, max),
      }}
      style={[styles.track, { height }, style]}
      {...restProps}
    >
      <Animated.View style={[styles.range, animatedStyle]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create(({ colors, radius }) => ({
  track: {
    position: 'relative',
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  range: {
    position: 'absolute',
    top: 0,
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
}));

function getProgressPercentage(value: number, min: number, max: number) {
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

export { Progress };
export type { ProgressProps };
