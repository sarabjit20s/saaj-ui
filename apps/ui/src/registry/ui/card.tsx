import { View, ViewProps } from 'react-native';
import { createContext, useContext, useMemo } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { Text, TextProps } from '@/registry/ui/text';

type CardVariants = {
  variant?: 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
};

type CardContextType = Required<CardVariants>;

const CardContext = createContext<CardContextType | null>(null);

function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) {
    throw new Error('useCard must be used within a <Card />');
  }
  return ctx;
}

type CardProps = ViewProps & CardVariants;

function Card({ variant = 'soft', size = 'md', style, ...props }: CardProps) {
  styles.useVariants({
    variant,
    size,
  });

  const contextValue = useMemo<CardContextType>(
    () => ({ variant, size }),
    [variant, size],
  );

  return (
    <CardContext value={contextValue}>
      <View style={[styles.card, style]} {...props} />
    </CardContext>
  );
}

function CardHeader({ style, ...props }: ViewProps) {
  const { variant, size } = useCard();

  styles.useVariants({
    variant,
    size,
  });

  return <View style={[styles.cardHeader, style]} {...props} />;
}

Card.Header = CardHeader;

function CardTitle(props: TextProps) {
  const { size } = useCard();
  return <Text variant={size === 'sm' ? 'labelLg' : 'headlineXs'} {...props} />;
}

Card.Title = CardTitle;

function CardDescription(props: TextProps) {
  const { size } = useCard();

  return (
    <Text
      variant={size === 'sm' ? 'bodySm' : 'bodyMd'}
      color="mutedForeground"
      {...props}
    />
  );
}

Card.Description = CardDescription;

function CardContent({ style, ...props }: ViewProps) {
  const { variant, size } = useCard();

  styles.useVariants({
    variant,
    size,
  });

  return <View style={[styles.cardContent, style]} {...props} />;
}

Card.Content = CardContent;

function CardFooter({ style, ...props }: ViewProps) {
  const { variant, size } = useCard();

  styles.useVariants({
    variant,
    size,
  });

  return <View style={[styles.cardFooter, style]} {...props} />;
}

Card.Footer = CardFooter;

const styles = StyleSheet.create(({ colors, radius, space }) => ({
  card: {
    position: 'relative',
    borderCurve: 'continuous',
    overflow: 'hidden',
    variants: {
      variant: {
        soft: {
          backgroundColor: colors.card,
        },
        outline: {
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        },
        ghost: {
          backgroundColor: colors.transparent,
        },
      },
      size: {
        sm: {
          borderRadius: radius.md,
          padding: space.xl,
          gap: space.lg,
        },
        md: {
          borderRadius: radius.lg,
          padding: space['2xl'],
          gap: space.xl,
        },
      },
    },
  },
  cardHeader: {
    variants: {
      size: {
        sm: {
          gap: space.sm,
        },
        md: {
          gap: space.md,
        },
      },
    },
  },
  cardContent: {
    variants: {
      size: {
        sm: {
          gap: space.md,
        },
        md: {
          gap: space.lg,
        },
      },
    },
  },
  cardFooter: {
    variants: {
      size: {
        sm: {
          gap: space.md,
        },
        md: {
          gap: space.lg,
        },
      },
    },
  },
}));

export { Card, useCard };
export type { CardProps };
