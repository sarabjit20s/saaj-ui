import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  FocusEvent,
  TextInput as RNTextInput,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
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
  withUnistyles(RNTextInput),
);

type TextInputSize = 'sm' | 'md' | 'lg';

type TextInputContextType = {
  invalid: boolean;
  size: TextInputSize;
};

const TextInputContext = createContext<TextInputContextType | null>(null);

const useTextInput = () => {
  const ctx = useContext(TextInputContext);
  if (!ctx) {
    throw new Error('useTextInput must be used within a <TextInput />');
  }
  return ctx;
};

const TextInputStartAdornmentContext = createContext<boolean>(false);

const animConfig = {
  duration: 200,
  easing: Easing.ease,
} as const;

type TextInputProps = React.ComponentPropsWithRef<typeof RNTextInput> & {
  invalid?: boolean;
  size?: TextInputSize;
  startAddon?: React.ReactNode;
  endAddon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

function TextInput({
  invalid = false,
  size = 'md',
  startAddon,
  endAddon,
  containerStyle,
  style,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  ...restProps
}: TextInputProps) {
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

  const paddingKey = getPaddingKey(!!startAddon, !!endAddon);

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

  const animatedTextInputProps = useAnimatedProps<RNTextInput['props']>(() => {
    return {
      placeholderTextColor: animatedTheme.value.colors.mutedForeground,
    };
  });

  const contextValue = useMemo<TextInputContextType>(() => {
    return {
      invalid,
      size,
    };
  }, [invalid, size]);

  return (
    <TextInputContext value={contextValue}>
      <Animated.View
        style={[styles.container, animatedContainerStyle, containerStyle]}
      >
        <TextInputStartAdornmentContext value={!!startAddon}>
          {startAddon}
        </TextInputStartAdornmentContext>
        <AnimatedTextInput
          onBlur={onBlur}
          onFocus={onFocus}
          style={[styles.textInput(paddingKey), style]}
          animatedProps={animatedTextInputProps}
          {...restProps}
        />
        {endAddon}
      </Animated.View>
    </TextInputContext>
  );
}

type TextInputAdornmentProps = React.ComponentPropsWithRef<typeof View>;

function TextInputAdornment({ style, ...restProps }: TextInputAdornmentProps) {
  const { size } = useTextInput();

  const isStartAdornment = useContext(TextInputStartAdornmentContext);

  styles.useVariants({
    size,
  });

  return (
    <View
      style={[styles.adornmentContainer(isStartAdornment), style]}
      {...restProps}
    />
  );
}

TextInput.Adornment = TextInputAdornment;

function getPaddingKey(
  hasStartAdornment: boolean,
  hasEndAdornment: boolean,
): 'none' | 'paddingEnd' | 'paddingStart' | 'paddingHorizontal' {
  return hasStartAdornment && hasEndAdornment
    ? 'none'
    : hasStartAdornment
    ? 'paddingEnd'
    : hasEndAdornment
    ? 'paddingStart'
    : 'paddingHorizontal';
}

const styles = StyleSheet.create(({ colors, radius, space, typography }) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderCurve: 'continuous',
    variants: {
      size: {
        sm: {
          height: 36,
          borderRadius: radius.sm,
        },
        md: {
          height: 48,
          borderRadius: radius.md,
        },
        lg: {
          height: 56,
          borderRadius: radius.lg,
        },
      },
    },
  },
  textInput: (
    paddingKey: 'paddingEnd' | 'paddingHorizontal' | 'paddingStart' | 'none',
  ) => ({
    flex: 1,
    width: '100%',
    color: colors.foreground,
    variants: {
      size: {
        sm: {
          fontSize: typography.variants.bodySm.fontSize,
          [paddingKey]: space.lg,
        },
        md: {
          fontSize: typography.variants.bodyMd.fontSize,
          [paddingKey]: space.xl,
        },
        lg: {
          fontSize: typography.variants.bodyLg.fontSize,
          [paddingKey]: space['2xl'],
        },
      },
    },
  }),
  adornmentContainer: (isStartAdornment: boolean) => ({
    justifyContent: 'center',
    variants: {
      size: {
        sm: {
          paddingStart: space.md,
          paddingEnd: isStartAdornment ? space.sm : space.xs,
        },
        md: {
          paddingStart: space.lg,
          paddingEnd: isStartAdornment ? space.md : space.sm,
        },
        lg: {
          paddingStart: space.xl,
          paddingEnd: isStartAdornment ? space.lg : space.md,
        },
      },
    },
  }),
}));

export { TextInput, useTextInput };
export type { TextInputProps };
