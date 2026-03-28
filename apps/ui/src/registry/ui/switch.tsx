import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useAnimatedTheme } from 'react-native-unistyles/reanimated';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useControllableState } from '@/registry/hooks/use-controllable-state';

type SwitchContextType = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled: boolean;
  pressed: SharedValue<boolean>;
};

const SwitchContext = createContext<SwitchContextType | null>(null);

const useSwitch = () => {
  const ctx = useContext(SwitchContext);
  if (!ctx) {
    throw new Error('useSwitch must be used within a <Switch />');
  }
  return ctx;
};

type SwitchProps = Omit<
  React.ComponentPropsWithRef<typeof Pressable>,
  'style'
> & {
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?:
    | StyleProp<ViewStyle>
    | ((
        state: PressableStateCallbackType,
        context: SwitchContextType,
      ) => StyleProp<ViewStyle>);
};

function Switch({
  accessibilityState,
  children,
  defaultChecked,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  disabled = false,
  onPress: onPressProp,
  onPressIn: onPressInProp,
  onPressOut: onPressOutProp,
  style,
  ...restProps
}: SwitchProps) {
  const [checked, onCheckedChange] = useControllableState({
    defaultValue: defaultChecked ?? false,
    controlledValue: checkedProp,
    onControlledChange: onCheckedChangeProp,
  });

  const pressed = useSharedValue(false);

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      onCheckedChange(value => !value);
      onPressProp?.(e);
    },
    [onPressProp, onCheckedChange],
  );

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      pressed.value = true;
      onPressInProp?.(e);
    },
    [pressed, onPressInProp],
  );

  const onPressOut = useCallback(
    (e: GestureResponderEvent) => {
      pressed.value = false;
      onPressOutProp?.(e);
    },
    [pressed, onPressOutProp],
  );

  const contextValue = useMemo<SwitchContextType>(
    () => ({
      checked,
      onCheckedChange,
      disabled: !!disabled,
      pressed,
    }),
    [checked, onCheckedChange, disabled, pressed],
  );

  return (
    <SwitchContext value={contextValue}>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{
          ...accessibilityState,
          checked: checked,
          disabled: !!disabled,
        }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={state => [
          typeof style === 'function' ? style(state, contextValue) : style,
        ]}
        {...restProps}
      >
        {children ?? <SwitchIndicator />}
      </Pressable>
    </SwitchContext>
  );
}

type SwitchStateProps = {
  children?: React.ReactNode | ((ctx: SwitchContextType) => React.ReactNode);
};

function SwitchState({ children }: SwitchStateProps) {
  const ctx = useSwitch();
  if (typeof children === 'function') {
    return children(ctx);
  }
  return children;
}

Switch.State = SwitchState;

const animConfig = {
  duration: 200,
  easing: Easing.out(Easing.ease),
} as const;

const GAP = 2.5; // gap between track and thumb
const TRACK_HEIGHT = 28;
const TRACK_WIDTH = TRACK_HEIGHT * 1.75;
const THUMB_HEIGHT = TRACK_HEIGHT - GAP * 2;
const THUMB_WIDTH = THUMB_HEIGHT;
const PRESSED_THUMB_WIDTH = THUMB_WIDTH * 1.15;

type SwitchIndicatorProps = React.ComponentPropsWithRef<typeof Animated.View>;

function SwitchIndicator({ style, ...restProps }: SwitchIndicatorProps) {
  const { checked, disabled, pressed } = useSwitch();

  const theme = useAnimatedTheme();

  const trackAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(disabled ? 0.5 : 1, animConfig),
      height: TRACK_HEIGHT,
      width: TRACK_WIDTH,
      backgroundColor: withTiming(
        checked ? theme.value.colors.primary : theme.value.colors.switch,
        animConfig,
      ),
      boxShadow: `inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05)`,
      overflow: 'hidden',
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: THUMB_HEIGHT,
      width: withTiming(
        pressed.value ? PRESSED_THUMB_WIDTH : THUMB_WIDTH,
        animConfig,
      ),
      top: GAP,
      left: withTiming(
        checked
          ? pressed.value
            ? TRACK_WIDTH - GAP - PRESSED_THUMB_WIDTH
            : TRACK_WIDTH - GAP - THUMB_WIDTH
          : GAP,
        animConfig,
      ),
      backgroundColor: withTiming(
        checked
          ? theme.value.colors.primaryForeground
          : theme.value.colors.white,
        animConfig,
      ),
      boxShadow: `0px 2px 8px 0px rgba(0, 0, 0, 0.1)`,
    };
  });

  return (
    <Animated.View
      style={[styles.radius, trackAnimatedStyles, style]}
      {...restProps}
    >
      <Animated.View style={[styles.radius, thumbAnimatedStyle]} />
    </Animated.View>
  );
}

Switch.Indicator = SwitchIndicator;

const styles = StyleSheet.create(({ radius }) => ({
  radius: {
    borderRadius: radius.full,
    borderCurve: 'continuous',
  },
}));

export { Switch, useSwitch };
export type { SwitchProps };
