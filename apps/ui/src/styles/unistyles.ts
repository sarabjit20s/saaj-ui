import { StyleSheet } from 'react-native-unistyles';

import { themes, Themes } from './themes';
import { breakpoints, Breakpoints } from './tokens/breakpoints';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends Themes {}
  export interface UnistylesBreakpoints extends Breakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  breakpoints,
  themes,
});
