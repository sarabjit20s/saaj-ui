import React, { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon, IconProps } from '@/registry/ui/icon';
import { Text, TextProps } from '@/registry/ui/text';
import { Color } from '@/styles/tokens/colors';

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'outline';

type BadgeContextType = {
  variant: BadgeVariant;
};

const BadgeContext = createContext<BadgeContextType | null>(null);

const useBadge = () => {
  const ctx = useContext(BadgeContext);
  if (!ctx) {
    throw new Error('useBadge must be used within a <Badge />');
  }
  return ctx;
};

type BadgeProps = React.ComponentPropsWithRef<typeof View> & {
  variant?: BadgeVariant;
  iconOnly?: boolean;
};

function Badge({
  variant = 'primary',
  iconOnly = false,
  style,
  ...restProps
}: BadgeProps) {
  styles.useVariants({
    variant,
  });

  const contextValue = useMemo<BadgeContextType>(() => {
    return {
      variant,
    };
  }, [variant]);

  return (
    <BadgeContext value={contextValue}>
      <View
        style={[styles.badge, iconOnly && styles.badgeIconOnly, style]}
        {...restProps}
      />
    </BadgeContext>
  );
}

const fgColorMap: Record<NonNullable<BadgeProps['variant']>, Color> = {
  primary: 'primaryForeground',
  secondary: 'secondaryForeground',
  destructive: 'destructiveForeground',
  success: 'successForeground',
  outline: 'secondaryForeground',
};

function BadgeText(props: TextProps) {
  const { variant } = useBadge();

  return <Text color={fgColorMap[variant]} variant="labelXs" {...props} />;
}

Badge.Text = BadgeText;

function BadgeIcon(props: IconProps) {
  const { variant } = useBadge();

  return <Icon color={fgColorMap[variant]} size={14} {...props} />;
}

Badge.Icon = BadgeIcon;

const styles = StyleSheet.create(({ colors, radius, space }) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderCurve: 'continuous',
    gap: space.xs,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
    variants: {
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
        success: {
          backgroundColor: colors.success,
        },
        outline: {
          borderWidth: 1,
          borderColor: colors.border,
        },
      },
    },
  },
  badgeIconOnly: {
    paddingHorizontal: space.xs,
  },
}));

export { Badge, useBadge };
export type { BadgeProps };
