import React, { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon, IconProps } from '@/registry/ui/icon';
import { Text, TextProps } from '@/registry/ui/text';
import { Color } from '@/styles/tokens/colors';

type AlertVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'outline';

type AlertContextType = {
  variant: AlertVariant;
};

const AlertContext = createContext<AlertContextType | null>(null);

const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within a <Alert />');
  }
  return ctx;
};

type AlertProps = React.ComponentProps<typeof View> & {
  variant?: AlertVariant;
};

function Alert({ variant = 'primary', style, ...restProps }: AlertProps) {
  styles.useVariants({
    variant,
  });

  const contextValue = useMemo<AlertContextType>(
    () => ({
      variant,
    }),
    [variant],
  );

  return (
    <AlertContext value={contextValue}>
      <View
        accessibilityRole="alert"
        style={[styles.alert, style]}
        {...restProps}
      />
    </AlertContext>
  );
}

function AlertContent({
  style,
  ...restProps
}: React.ComponentProps<typeof View>) {
  return <View style={[styles.content, style]} {...restProps} />;
}

Alert.Content = AlertContent;

const fgColorMap: Record<NonNullable<AlertProps['variant']>, Color> = {
  primary: 'primarySubtleForeground',
  secondary: 'secondaryForeground',
  destructive: 'destructiveSubtleForeground',
  success: 'successSubtleForeground',
  outline: 'secondaryForeground',
};

function AlertTitle(props: TextProps) {
  const { variant } = useAlert();
  return <Text color={fgColorMap[variant]} variant="labelMd" {...props} />;
}

Alert.Title = AlertTitle;

function AlertDescription(props: TextProps) {
  const { variant } = useAlert();
  return <Text color={fgColorMap[variant]} variant="bodySm" {...props} />;
}

Alert.Description = AlertDescription;

function AlertIcon(props: IconProps) {
  const { variant } = useAlert();

  styles.useVariants({
    variant,
  });

  return (
    <Icon
      color={fgColorMap[variant]}
      size={20}
      style={styles.icon}
      {...props}
    />
  );
}

Alert.Icon = AlertIcon;

const styles = StyleSheet.create(({ colors, radius, space }) => ({
  alert: {
    flexDirection: 'row',
    gap: space.lg,
    alignItems: 'center',
    padding: space.xl,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    width: '100%',
    variants: {
      variant: {
        primary: {
          backgroundColor: colors.primarySubtle,
        },
        secondary: {
          backgroundColor: colors.secondary,
        },
        destructive: {
          backgroundColor: colors.destructiveSubtle,
        },
        success: {
          backgroundColor: colors.successSubtle,
        },
        outline: {
          borderWidth: 1,
          borderColor: colors.border,
        },
      },
    },
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: space.xs,
  },
  icon: {
    alignSelf: 'flex-start',
    marginTop: 1,
  },
}));

export { Alert, useAlert };
export type { AlertProps };
