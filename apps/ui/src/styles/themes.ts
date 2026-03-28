import { Colors, lightThemeColors, darkThemeColors } from './tokens/colors';
import { radius, Radius } from './tokens/radius';
import { space, Space } from './tokens/space';
import { typography, Typography } from './tokens/typography';

export type Theme = {
  colors: Colors;
  radius: Radius;
  space: Space;
  typography: Typography;
};

export type Themes = {
  light: Theme;
  dark: Theme;
};

export const lightTheme: Theme = {
  colors: lightThemeColors,
  radius,
  space,
  typography,
};

export const darkTheme: Theme = {
  colors: darkThemeColors,
  radius,
  space,
  typography,
};

export const themes: Themes = {
  light: lightTheme,
  dark: darkTheme,
};
