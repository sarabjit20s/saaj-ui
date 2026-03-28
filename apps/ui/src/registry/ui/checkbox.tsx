import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  GestureResponderEvent,
  Insets,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useAnimatedTheme } from 'react-native-unistyles/reanimated';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useControllableState } from '@/registry/hooks/use-controllable-state';

type CheckboxContextType = {
  checked: boolean;
  disabled: boolean;
  progress: SharedValue<number>;
};

const CheckboxContext = createContext<CheckboxContextType | null>(null);

const useCheckbox = () => {
  const ctx = useContext(CheckboxContext);
  if (!ctx) {
    throw new Error('useCheckbox must be used within a <Checkbox />');
  }
  return ctx;
};

const DEFAULT_HIT_SLOP: Insets = {
  top: 8,
  left: 8,
  bottom: 8,
  right: 8,
};

type CheckboxProps = Omit<
  React.ComponentPropsWithRef<typeof Pressable>,
  'style'
> & {
  style?:
    | StyleProp<ViewStyle>
    | ((
        state: PressableStateCallbackType,
        context: CheckboxContextType,
      ) => StyleProp<ViewStyle>);
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function Checkbox({
  accessibilityState,
  children,
  defaultChecked,
  checked: checkedProp,
  onCheckedChange,
  disabled = false,
  onPress: onPressProp,
  style,
  ...restProps
}: CheckboxProps) {
  const [checked, setChecked] = useControllableState({
    defaultValue: defaultChecked ?? false,
    controlledValue: checkedProp,
    onControlledChange: onCheckedChange,
  });

  const progress = useSharedValue(checked ? 1 : 0);

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      const newValue = !checked;
      setChecked(newValue);
      progress.value = withTiming(newValue ? 1 : 0, { duration: 250 });
      onPressProp?.(e);
    },
    [onPressProp, checked, setChecked, progress],
  );

  const contextValue = useMemo<CheckboxContextType>(() => {
    return {
      checked,
      disabled: !!disabled,
      progress,
    };
  }, [checked, disabled, progress]);

  return (
    <CheckboxContext value={contextValue}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{
          ...accessibilityState,
          checked,
          disabled: !!disabled,
        }}
        disabled={disabled}
        onPress={onPress}
        style={state => [
          styles.checkbox,
          typeof style === 'function' ? style(state, contextValue) : style,
        ]}
        {...restProps}
      >
        {children ?? <CheckboxIndicator />}
      </Pressable>
    </CheckboxContext>
  );
}

type CheckboxStateProps = {
  children?: React.ReactNode | ((ctx: CheckboxContextType) => React.ReactNode);
};

function CheckboxState({ children }: CheckboxStateProps) {
  const ctx = useCheckbox();
  if (typeof children === 'function') {
    return children(ctx);
  }
  return children;
}

Checkbox.State = CheckboxState;

type CheckboxIndicatorProps = {
  children?: React.ReactNode;
};

function CheckboxIndicator({ children }: CheckboxIndicatorProps) {
  const { disabled, progress } = useCheckbox();
  const animatedTheme = useAnimatedTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: disabled ? 0.5 : 1,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', animatedTheme.value.colors.primary],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [animatedTheme.value.colors.border, animatedTheme.value.colors.primary],
    ),
  }));

  return (
    <Animated.View
      hitSlop={DEFAULT_HIT_SLOP}
      style={[styles.indicator, animatedStyle]}
    >
      {children ?? <CheckboxIcon />}
    </Animated.View>
  );
}

Checkbox.Indicator = CheckboxIndicator;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CHECKMARK_PATH = 'M6 12L10 16L18 8';
const PATH_LENGTH = 20;

type CheckboxIconProps = {
  size?: number;
};

function CheckboxIcon({ size = 22 }: CheckboxIconProps) {
  const { progress } = useCheckbox();
  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: PATH_LENGTH * (1 - progress.value),
  }));

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d={CHECKMARK_PATH}
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={PATH_LENGTH}
        animatedProps={animatedPathProps}
      />
    </Svg>
  );
}

Checkbox.Icon = CheckboxIcon;

const styles = StyleSheet.create(({ radius, space }) => ({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: radius.xs,
    borderCurve: 'continuous',
  },
}));

export { Checkbox, useCheckbox };
export type { CheckboxProps };
