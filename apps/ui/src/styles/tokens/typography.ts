import { Platform, TextStyle } from 'react-native';

type TextVariant = {
  fontSize: number;
  fontWeight?: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing?: number;
};

export type TextVariants = {
  displayLg: TextVariant;
  displayMd: TextVariant;
  displaySm: TextVariant;
  displayXs: TextVariant;
  headlineLg: TextVariant;
  headlineMd: TextVariant;
  headlineSm: TextVariant;
  headlineXs: TextVariant;
  labelLg: TextVariant;
  labelMd: TextVariant;
  labelSm: TextVariant;
  labelXs: TextVariant;
  bodyLg: TextVariant;
  bodyMd: TextVariant;
  bodySm: TextVariant;
  bodyXs: TextVariant;
};

export type Typography = {
  variants: TextVariants;
};

// These values are defined using the Major second scale (1.125)
// Default font size is 16px

// Line height multiplier for
// body: 1.5, label: 1.4,, heading: 1.3, display: 1.2

const androidTypography: Typography = {
  variants: {
    displayLg: {
      fontSize: 52,
      fontWeight: '700',
      lineHeight: 62,
      letterSpacing: 0.5,
    },
    displayMd: {
      fontSize: 44,
      fontWeight: '700',
      lineHeight: 52,
      letterSpacing: 0.25,
    },
    displaySm: {
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 48,
      letterSpacing: 0.1,
    },
    displayXs: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 42,
    },
    headlineLg: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 42,
    },
    headlineMd: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 36,
    },
    headlineSm: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
    },
    headlineXs: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
    },
    labelLg: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0.25,
    },
    labelMd: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
      letterSpacing: 0.25,
    },
    labelSm: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
      letterSpacing: 0.4,
    },
    labelXs: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    bodyLg: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
    bodyMd: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0.25,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodyXs: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
      letterSpacing: 0.4,
    },
  },
};

const iosTypography: Typography = {
  variants: {
    displayLg: {
      fontSize: 52,
      fontWeight: '700',
      lineHeight: 62,
    },
    displayMd: {
      fontSize: 44,
      fontWeight: '700',
      lineHeight: 52,
    },
    displaySm: {
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 48,
    },
    displayXs: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 42,
    },
    headlineLg: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 42,
    },
    headlineMd: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 36,
    },
    headlineSm: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
    },
    headlineXs: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
    },
    labelLg: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
    },
    labelMd: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 22,
    },
    labelSm: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
    },
    labelXs: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
    bodyLg: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
    },
    bodyMd: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    bodyXs: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
    },
  },
};

export const typography = Platform.select<Typography>({
  android: androidTypography,
  ios: iosTypography,
  default: iosTypography,
});
