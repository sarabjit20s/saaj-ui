import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import Animated, {
  AnimatedStyle,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

import { Text, TextProps } from '@/registry/ui/text';
import { Icon, IconProps } from '@/registry/ui/icon';
import { Color } from '@/styles/tokens/colors';

const AnimatedPressable = Animated.createAnimatedComponent(
  withUnistyles(Pressable),
);

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'destructiveSubtle'
  | 'outline'
  | 'ghost'
  | 'link';

type ButtonContextType = {
  size: ButtonSize;
  variant: ButtonVariant;
  iconOnly: boolean;
};

const ButtonContext = createContext<ButtonContextType | null>(null);

const useButton = () => {
  const ctx = useContext(ButtonContext);
  if (!ctx) {
    throw new Error('useButton must be used within a <Button />');
  }
  return ctx;
};

type ButtonProps = React.ComponentPropsWithoutRef<typeof AnimatedPressable> & {
  // reanimated changes the type of the `key` prop on `AnimatedPressable`
  key?: React.Key;
  ref?: React.Ref<View>;
  size?: ButtonSize;
  variant?: ButtonVariant;
  iconOnly?: boolean;
  fill?: boolean;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

const animConfig: WithTimingConfig = {
  duration: 120,
  easing: Easing.quad,
};

function Button({
  size = 'md',
  variant = 'primary',
  iconOnly = false,
  fill = false,
  disabled,
  style,
  onPressIn: onPressInProp,
  onPressOut: onPressOutProp,
  ...restProps
}: ButtonProps) {
  styles.useVariants({
    size,
    variant,
    fill,
  });

  const pressed = useSharedValue(false);

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      pressed.value = true;
      typeof onPressInProp === 'function' && onPressInProp(e);
    },
    [pressed, onPressInProp],
  );

  const onPressOut = useCallback(
    (e: GestureResponderEvent) => {
      pressed.value = false;
      typeof onPressOutProp === 'function' && onPressOutProp(e);
    },
    [pressed, onPressOutProp],
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        disabled ? 0.5 : pressed.value ? 0.95 : 1,
        animConfig,
      ),
      transform: [
        {
          scale: withTiming(pressed.value ? 0.98 : 1, animConfig),
        },
      ],
    };
  });

  const contextValue = useMemo<ButtonContextType>(() => {
    return {
      size,
      variant,
      iconOnly,
    };
  }, [size, variant, iconOnly]);

  return (
    <ButtonContext value={contextValue}>
      <AnimatedPressable
        accessibilityRole="button"
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.button,
          iconOnly && styles.buttonIconOnly,
          animatedStyles,
          style,
        ]}
        {...restProps}
      />
    </ButtonContext>
  );
}

const fgColorMap: Record<NonNullable<ButtonProps['variant']>, Color> = {
  primary: 'primaryForeground',
  secondary: 'secondaryForeground',
  destructive: 'destructiveForeground',
  destructiveSubtle: 'destructiveSubtleForeground',
  outline: 'secondaryForeground',
  ghost: 'secondaryForeground',
  link: 'primary',
};
const textVariantMap: Record<
  NonNullable<ButtonProps['size']>,
  NonNullable<TextProps['variant']>
> = {
  xs: 'labelXs',
  sm: 'labelSm',
  md: 'labelMd',
  lg: 'labelLg',
};

function ButtonText(props: TextProps) {
  const { size, variant } = useButton();

  return (
    <Text
      color={fgColorMap[variant]}
      variant={textVariantMap[size]}
      {...props}
    />
  );
}

Button.Text = ButtonText;

const iconSizeMap: Record<
  NonNullable<ButtonProps['size']>,
  NonNullable<IconProps['size']>
> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
};
const iconOnlySizeMap: Record<
  NonNullable<ButtonProps['size']>,
  NonNullable<IconProps['size']>
> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
};

function ButtonIcon(props: IconProps) {
  const { size, variant, iconOnly } = useButton();

  return (
    <Icon
      color={fgColorMap[variant]}
      size={iconOnly ? iconOnlySizeMap[size] : iconSizeMap[size]}
      {...props}
    />
  );
}

Button.Icon = ButtonIcon;

const styles = StyleSheet.create(({ colors, radius, space }) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    variants: {
      size: {
        xs: {
          minWidth: 28,
          height: 28,
          maxHeight: 28,
          paddingHorizontal: space.md,
          gap: space.xs,
          borderRadius: radius.xs,
        },
        sm: {
          minWidth: 36,
          height: 36,
          maxHeight: 36,
          paddingHorizontal: space.lg,
          gap: space.sm,
          borderRadius: radius.sm,
        },
        md: {
          minWidth: 48,
          height: 48,
          maxHeight: 48,
          paddingHorizontal: space.xl,
          gap: space.md,
          borderRadius: radius.md,
        },
        lg: {
          minWidth: 56,
          height: 56,
          maxHeight: 56,
          paddingHorizontal: space['2xl'],
          gap: space.md,
          borderRadius: radius.lg,
        },
      },
      variant: {
        primary: {
          backgroundColor: colors.primary,
        },
        secondary: {
          backgroundColor: colors.secondary,
        },
        destructive: {
          backgroundColor: colors.destructive,
        },
        destructiveSubtle: {
          backgroundColor: colors.destructiveSubtle,
        },
        outline: {
          borderWidth: 1,
          borderColor: colors.border,
        },
        ghost: {},
        link: {},
      },
      fill: {
        true: {
          width: '100%',
          flex: 1,
        },
        false: {
          width: 'auto',
        },
      },
    },
  },
  buttonIconOnly: {
    paddingHorizontal: 0,
    variants: {
      size: {
        xs: {
          width: 28,
          height: 28,
        },
        sm: {
          width: 36,
          height: 36,
        },
        md: {
          width: 48,
          height: 48,
        },
        lg: {
          width: 56,
          height: 56,
        },
      },
    },
  },
}));

export { Button, useButton };
export type { ButtonProps };
