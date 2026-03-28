import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useAnimatedTheme } from 'react-native-unistyles/reanimated';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useControllableState } from '@/registry/hooks/use-controllable-state';

type RadioGroupContextType = {
  disabled?: boolean;
  value: string;
  onValueChange: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

const useRadioGroup = () => {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error('useRadioGroup must be used within a <RadioGroup />');
  }
  return ctx;
};

type RadioGroupProps = React.ComponentPropsWithRef<typeof View> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

function RadioGroup({
  accessibilityState,
  defaultValue,
  value: valueProp,
  onValueChange: onValueChangeProp,
  disabled,
  style,
  ...restProps
}: RadioGroupProps) {
  const [value, onValueChange] = useControllableState({
    defaultValue: defaultValue ?? '',
    controlledValue: valueProp,
    onControlledChange: onValueChangeProp,
  });

  const contextValue = useMemo<RadioGroupContextType>(
    () => ({
      value,
      onValueChange,
      disabled,
    }),
    [value, onValueChange, disabled],
  );

  return (
    <RadioGroupContext value={contextValue}>
      <View
        accessibilityRole="radiogroup"
        accessibilityState={{
          ...accessibilityState,
          disabled,
        }}
        style={[styles.group, style]}
        {...restProps}
      />
    </RadioGroupContext>
  );
}

type RadioGroupStateProps = {
  children?:
    | React.ReactNode
    | ((ctx: RadioGroupContextType) => React.ReactNode);
};

function RadioGroupState({ children }: RadioGroupStateProps) {
  const ctx = useRadioGroup();
  if (typeof children === 'function') {
    return children(ctx);
  }
  return children;
}

RadioGroup.State = RadioGroupState;

type RadioGroupItemContextType = {
  checked: boolean;
  disabled: boolean;
};

const RadioGroupItemContext = createContext<RadioGroupItemContextType | null>(
  null,
);

const useRadioGroupItem = () => {
  const context = useContext(RadioGroupItemContext);
  if (!context) {
    throw new Error(
      'useRadioGroupItem must be used within a <RadioGroupItem />',
    );
  }
  return context;
};

type RadioGroupItemProps = Omit<
  React.ComponentPropsWithRef<typeof Pressable>,
  'style'
> & {
  style?:
    | StyleProp<ViewStyle>
    | ((
        state: PressableStateCallbackType,
        context: RadioGroupItemContextType,
      ) => StyleProp<ViewStyle>);
  value: string;
};

function RadioGroupItem({
  accessibilityState,
  value,
  disabled: disabledProp,
  style,
  onPress: onPressProp,
  ...restProps
}: RadioGroupItemProps) {
  const rootContext = useRadioGroup();
  const checked = value === rootContext.value;
  const disabled = rootContext.disabled ?? disabledProp ?? false;

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      rootContext.onValueChange?.(value);
      onPressProp?.(e);
    },
    [rootContext, value, onPressProp],
  );

  const contextValue = useMemo<RadioGroupItemContextType>(
    () => ({
      checked,
      disabled,
    }),
    [checked, disabled],
  );

  return (
    <RadioGroupItemContext value={contextValue}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ ...accessibilityState, checked, disabled }}
        disabled={disabled}
        onPress={onPress}
        style={state => [
          styles.item,
          typeof style === 'function' ? style(state, contextValue) : style,
        ]}
        {...restProps}
      />
    </RadioGroupItemContext>
  );
}

RadioGroup.Item = RadioGroupItem;

type RadioGroupItemStateProps = {
  children?:
    | React.ReactNode
    | ((ctx: RadioGroupItemContextType) => React.ReactNode);
};

function RadioGroupItemState({ children }: RadioGroupItemStateProps) {
  const ctx = useRadioGroupItem();
  if (typeof children === 'function') {
    return children(ctx);
  }
  return children;
}

RadioGroup.ItemState = RadioGroupItemState;

const animConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.ease),
} as const;

type RadioGroupItemIndicatorProps = React.ComponentPropsWithRef<
  typeof Animated.View
>;

function RadioGroupItemIndicator({
  style,
  ...restProps
}: RadioGroupItemIndicatorProps) {
  const { checked, disabled } = useRadioGroupItem();

  const theme = useAnimatedTheme();

  const outerCircleStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: disabled
        ? theme.value.colors.muted
        : theme.value.colors.primary,
    };
  });

  const innerCircleStyles = useAnimatedStyle(() => {
    return {
      borderWidth: withTiming(checked ? 0 : 1.5, animConfig),
      borderColor: disabled
        ? theme.value.colors.borderSubtle
        : theme.value.colors.border,
      backgroundColor: theme.value.colors.background,
      transform: [
        {
          scale: withTiming(checked ? 0.45 : 1, animConfig),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.indicator, outerCircleStyles, style]}
      {...restProps}
    >
      <Animated.View style={[styles.indicator, innerCircleStyles]} />
    </Animated.View>
  );
}

RadioGroup.ItemIndicator = RadioGroupItemIndicator;

const styles = StyleSheet.create(({ space, radius }) => ({
  group: {
    gap: space.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.lg,
  },
  indicator: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.full,
    borderCurve: 'continuous',
  },
}));

export { RadioGroup, useRadioGroup, useRadioGroupItem };
export type { RadioGroupProps };
