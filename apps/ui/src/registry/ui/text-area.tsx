import React, { useCallback } from 'react';
import { FocusEvent, StyleProp, TextInput, ViewStyle } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import { useAnimatedTheme } from 'react-native-unistyles/reanimated';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(
  withUnistyles(TextInput),
);

const animConfig = {
  duration: 200,
  easing: Easing.ease,
} as const;

type TextAreaProps = React.ComponentPropsWithRef<typeof TextInput> & {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

function TextArea({
  size = 'md',
  invalid = false,
  style,
  containerStyle,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  ...restProps
}: TextAreaProps) {
  styles.useVariants({
    size,
  });

  const animatedTheme = useAnimatedTheme();

  const focused = useSharedValue(false);

  const onFocus = useCallback(
    (e: FocusEvent) => {
      focused.value = true;
      onFocusProp?.(e);
    },
    [focused, onFocusProp],
  );

  const onBlur = useCallback(
    (e: FocusEvent) => {
      focused.value = false;
      onBlurProp?.(e);
    },
    [focused, onBlurProp],
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedTheme.value.colors.input,
      borderColor: withTiming(
        invalid
          ? animatedTheme.value.colors.borderDestructive
          : focused.value
          ? animatedTheme.value.colors.borderPrimary
          : animatedTheme.value.colors.border,
        animConfig,
      ),
    };
  });

  const animatedTextInputProps = useAnimatedProps<TextInput['props']>(() => {
    return {
      placeholderTextColor: animatedTheme.value.colors.mutedForeground,
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedContainerStyle, containerStyle]}
    >
      <AnimatedTextInput
        multiline={true}
        textAlignVertical="top"
        style={[styles.textArea, style]}
        onFocus={onFocus}
        onBlur={onBlur}
        animatedProps={animatedTextInputProps}
        {...restProps}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create(({ colors, radius, space, typography }) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderCurve: 'continuous',
    variants: {
      size: {
        sm: {
          height: 80,
          paddingVertical: space.xs,
          paddingHorizontal: space.lg,
          borderRadius: radius.sm,
        },
        md: {
          height: 120,
          paddingVertical: space.md,
          paddingHorizontal: space.xl,
          borderRadius: radius.md,
        },
        lg: {
          height: 160,
          paddingVertical: space.lg,
          paddingHorizontal: space['2xl'],
          borderRadius: radius.lg,
        },
      },
    },
  },
  textArea: {
    flex: 1,
    width: '100%',
    color: colors.foreground,
    ...typography.variants.bodyMd,
  },
}));

export { TextArea };
export type { TextAreaProps };
