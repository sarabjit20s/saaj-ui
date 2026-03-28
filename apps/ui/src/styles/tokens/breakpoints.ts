export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

export type Breakpoints = typeof breakpoints;
