export const radius = {
  // xs: 4,
  // sm: 8,
  // md: 12,
  // lg: 16,
  // xl: 20,
  // '2xl': 24,
  // '3xl': 28,
  // '4xl': 32,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 36,
  '3xl': 48,
  '4xl': 56,
  none: 0,
  full: 9999,
} as const;

export type Radius = typeof radius;
