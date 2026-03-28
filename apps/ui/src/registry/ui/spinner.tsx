import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import { Color } from '@/styles/tokens/colors';

type SpinnerProps = {
  size?: number;
  color?: Color;
  /**
   * Whether the spinner is loading or not
   */
  loading?: boolean;
  /**
   * Speed of the spinner in milliseconds
   */
  speed?: number;
};

function Spinner({ loading = true, ...props }: SpinnerProps) {
  if (!loading) {
    return null;
  }
  return <SpinnerImpl loading={loading} {...props} />;
}

function SpinnerImpl({
  size = 24,
  color: colorProp = 'foreground',
  speed = 800,
}: SpinnerProps) {
  const { theme } = useUnistyles();

  const color = theme.colors[colorProp];

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: speed, easing: Easing.linear }),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Defs>
          <LinearGradient
            id="gradient"
            x1="75%"
            x2="50%"
            y1="0%"
            y2="100%"
            gradientTransform="rotate(-100)"
          >
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Path
          d="M10.25 1.55a1.5 1.5 0 1 1 .497 2.958A7.5 7.5 0 1 0 18 12a1.5 1.5 0 0 1 3 0c0 5.799-4.701 10.5-10.5 10.5S0 17.799 0 12C0 6.855 3.726 2.49 8.749 1.646"
          fill="url(#gradient)"
          transform="translate(1.5 0)"
        />
      </Svg>
    </Animated.View>
  );
}

export { Spinner };
export type { SpinnerProps };
