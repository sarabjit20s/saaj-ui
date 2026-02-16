import fs from 'fs-extra';
import z from 'zod';
import path from 'path';
import Color from 'colorjs.io';

import { getRegistryColors, getRegistryTokens } from '@/src/registry/api';
import {
  registryColorsSchema,
  registryTokensSchema,
} from '@/src/registry/schema';
import { Config } from '@/src/utils/get-config';
import { COLORS, GRAY_COLORS } from '@/src/registry/constants';

/**
 * Configure styles
 * - Create all the tokens files in the styles/tokens directory.
 * - Create themes file in the styles directory.
 * - Create unistyles config file in the styles directory.
 */
export async function initializeStyles(
  primaryColor: (typeof COLORS)[number]['name'],
  config: Config,
) {
  const grayColor = getRecommendedGrayColor(primaryColor);

  const tokens = await getRegistryTokens();

  const tokensDirPath = path.join(config.resolvedPaths.styles, 'tokens');

  // Create styles and tokens directory
  await fs.mkdir(tokensDirPath, { recursive: true });

  const colorsFileContent = await createColorsFileContent({
    primaryColor,
    grayColor,
  });

  // colors.ts
  await fs.writeFile(path.join(tokensDirPath, 'colors.ts'), colorsFileContent);

  // breakpoints.ts
  await fs.writeFile(
    path.join(tokensDirPath, 'breakpoints.ts'),
    createBreakpointsFileContent(tokens),
  );

  // radius.ts
  await fs.writeFile(
    path.join(tokensDirPath, 'radius.ts'),
    createRadiusFileContent(tokens),
  );

  // space.ts
  await fs.writeFile(
    path.join(tokensDirPath, 'space.ts'),
    createSpaceFileContent(tokens),
  );

  // typography.ts
  await fs.writeFile(
    path.join(tokensDirPath, 'typography.ts'),
    createTypographyFileContent(tokens),
  );

  // themes.ts
  await fs.writeFile(
    path.join(config.resolvedPaths.styles, 'themes.ts'),
    createThemesFileContent(),
  );

  // unistyles.ts
  await fs.writeFile(
    path.join(config.resolvedPaths.styles, 'unistyles.ts'),
    createUnistylesFileContent(),
  );
}

function getContrastColor(background: string) {
  const white = new Color('#fff');

  try {
    const backgroundColor = new Color(background);

    if (Math.abs(backgroundColor.contrastAPCA(white)) < 60) {
      const [L, C, H] = backgroundColor.coords;
      return new Color('oklch', [0.25, Math.max(0.08 * C, 0.04), H]).toString({
        format: 'hex',
      });
    }

    return white.toString({
      format: 'hex',
    });
  } catch (error) {
    return white.toString({
      format: 'hex',
    });
  }
}

async function createColorsFileContent(colors: {
  primaryColor: (typeof COLORS)[number]['name'];
  grayColor: (typeof COLORS)[number]['name'];
}) {
  const { light: lightColors, dark: darkColors } = await getRegistryColors();

  const primaryColorAlpha = `${colors.primaryColor}A` as const;
  const grayColorAlpha = `${colors.grayColor}A` as const;

  const primaryScale = lightColors[colors.primaryColor];
  const primaryScaleAlpha = lightColors[primaryColorAlpha];
  const primaryDarkScale = darkColors[colors.primaryColor];
  const primaryDarkScaleAlpha = darkColors[primaryColorAlpha];

  const grayScale = lightColors[colors.grayColor];
  const grayScaleAlpha = lightColors[grayColorAlpha];
  const grayDarkScale = darkColors[colors.grayColor];
  const grayDarkScaleAlpha = darkColors[grayColorAlpha];

  const destructiveScale = lightColors.red;
  const destructiveScaleAlpha = lightColors.redA;
  const destructiveDarkScale = darkColors.red;
  const destructiveDarkScaleAlpha = darkColors.redA;

  const successScale = lightColors.green;
  const successScaleAlpha = lightColors.greenA;
  const successDarkScale = darkColors.green;
  const successDarkScaleAlpha = darkColors.greenA;

  const warningScale = lightColors.amber;
  const warningScaleAlpha = lightColors.amberA;
  const warningDarkScale = darkColors.amber;
  const warningDarkScaleAlpha = darkColors.amberA;

  return `const white = '#fff';
const black = '#000';
const transparent = 'transparent';

const primary = ${createColorScaleObj(primaryScale, primaryScaleAlpha, 'primary')}

const primaryDark = ${createColorScaleObj(primaryDarkScale, primaryDarkScaleAlpha, 'primary')}

const gray = ${createColorScaleObj(grayScale, grayScaleAlpha, 'gray')}

const grayDark = ${createColorScaleObj(grayDarkScale, grayDarkScaleAlpha, 'gray')}

const destructive = ${createColorScaleObj(destructiveScale, destructiveScaleAlpha, 'destructive')}

const destructiveDark = ${createColorScaleObj(destructiveDarkScale, destructiveDarkScaleAlpha, 'destructive')}

const success = ${createColorScaleObj(successScale, successScaleAlpha, 'success')}

const successDark = ${createColorScaleObj(successDarkScale, successDarkScaleAlpha, 'success')}

const warning = ${createColorScaleObj(warningScale, warningScaleAlpha, 'warning')}

const warningDark = ${createColorScaleObj(warningDarkScale, warningDarkScaleAlpha, 'warning')}

export const lightThemeColors = {
  ...primary,
  ...gray,
  ...destructive,
  ...success,
  ...warning,
  white,
  black,
  transparent,
  background: '#fff',
  foreground: gray.gray12,

  primary: primary.primary9,
  primaryForeground: primary.primaryContrast,
  primarySubtle: primary.primary3,
  primarySubtleForeground: primary.primary12,
  primaryMinimal: primary.primary2,
  primaryMinimalForeground: primary.primary11,

  destructive: destructive.destructive9,
  destructiveForeground: destructive.destructiveContrast,
  destructiveSubtle: destructive.destructive3,
  destructiveSubtleForeground: destructive.destructive12,
  destructiveMinimal: destructive.destructive2,
  destructiveMinimalForeground: destructive.destructive11,

  success: success.success9,
  successForeground: success.successContrast,
  successSubtle: success.success3,
  successSubtleForeground: success.success12,
  successMinimal: success.success2,
  successMinimalForeground: success.success11,

  secondary: gray.grayA4,
  secondaryForeground: gray.gray12,

  accent: gray.grayA3,
  accentForeground: gray.gray12,

  muted: gray.grayA3,
  mutedForeground: gray.gray11,

  card: gray.grayA3,
  cardForeground: gray.gray12,

  popover: gray.gray2,
  popoverForeground: gray.gray11,

  dialog: '#fff',

  border: gray.gray6,
  borderSubtle: gray.gray5,
  borderMinimal: gray.gray4,
  borderPrimary: primary.primary8,
  borderDestructive: destructive.destructive8,

  input: gray.grayA2,
  switch: gray.grayA4,

  overlay: gray.grayA7,
} as const;

export type Color = keyof typeof lightThemeColors;
export type Colors = Record<Color, string>;

export const darkThemeColors: Colors = {
  ...primaryDark,
  ...grayDark,
  ...destructiveDark,
  ...successDark,
  ...warningDark,
  white,
  black,
  transparent,
  background: '#0a0a0a',
  foreground: grayDark.gray12,

  primary: primaryDark.primary9,
  primaryForeground: primaryDark.primaryContrast,
  primarySubtle: primaryDark.primary3,
  primarySubtleForeground: primaryDark.primary12,
  primaryMinimal: primaryDark.primary2,
  primaryMinimalForeground: primaryDark.primary11,

  destructive: destructiveDark.destructive9,
  destructiveForeground: destructiveDark.destructiveContrast,
  destructiveSubtle: destructiveDark.destructive3,
  destructiveSubtleForeground: destructiveDark.destructive12,
  destructiveMinimal: destructiveDark.destructive2,
  destructiveMinimalForeground: destructiveDark.destructive11,

  success: successDark.success9,
  successForeground: successDark.successContrast,
  successSubtle: successDark.success3,
  successSubtleForeground: successDark.success12,
  successMinimal: successDark.success2,
  successMinimalForeground: successDark.success11,

  secondary: grayDark.grayA4,
  secondaryForeground: grayDark.gray12,

  accent: grayDark.grayA3,
  accentForeground: grayDark.gray12,

  muted: grayDark.grayA3,
  mutedForeground: grayDark.gray11,

  card: grayDark.grayA3,
  cardForeground: grayDark.gray12,

  popover: grayDark.gray2,
  popoverForeground: grayDark.gray11,

  dialog: grayDark.gray2,

  border: grayDark.gray6,
  borderSubtle: grayDark.gray5,
  borderMinimal: grayDark.gray4,
  borderPrimary: primaryDark.primary8,
  borderDestructive: destructiveDark.destructive8,

  input: grayDark.grayA2,
  switch: grayDark.grayA4,

  overlay: 'rgba(0, 0, 0, 0.6)',
};
`;
}

function createColorScaleObj(
  color: z.infer<typeof registryColorsSchema.valueType>,
  colorAlpha: z.infer<typeof registryColorsSchema.valueType>,
  name: string,
) {
  return `{
  ${name}1: "${color[0].hex}",
  ${name}2: "${color[1].hex}",
  ${name}3: "${color[2].hex}",
  ${name}4: "${color[3].hex}",
  ${name}5: "${color[4].hex}",
  ${name}6: "${color[5].hex}",
  ${name}7: "${color[6].hex}",
  ${name}8: "${color[7].hex}",
  ${name}9: "${color[8].hex}",
  ${name}10: "${color[9].hex}",
  ${name}11: "${color[10].hex}",
  ${name}12: "${color[11].hex}",

  ${name}A1: "${colorAlpha[0].hex}",
  ${name}A2: "${colorAlpha[1].hex}",
  ${name}A3: "${colorAlpha[2].hex}",
  ${name}A4: "${colorAlpha[3].hex}",
  ${name}A5: "${colorAlpha[4].hex}",
  ${name}A6: "${colorAlpha[5].hex}",
  ${name}A7: "${colorAlpha[6].hex}",
  ${name}A8: "${colorAlpha[7].hex}",
  ${name}A9: "${colorAlpha[8].hex}",
  ${name}A10: "${colorAlpha[9].hex}",
  ${name}A11: "${colorAlpha[10].hex}",
  ${name}A12: "${colorAlpha[11].hex}",

  ${name}Contrast: "${getContrastColor(color[8].hex)}",
};`;
}

function createBreakpointsFileContent(
  tokens: z.infer<typeof registryTokensSchema>,
) {
  return `export const breakpoints = ${JSON.stringify(tokens.breakpoints, null, 2)} as const;

export type Breakpoints = typeof breakpoints;
`;
}

function createRadiusFileContent(tokens: z.infer<typeof registryTokensSchema>) {
  return `export const radius = ${JSON.stringify(tokens.radius, null, 2)} as const;

export type Radius = typeof radius;
`;
}

function createSpaceFileContent(tokens: z.infer<typeof registryTokensSchema>) {
  return `export const space = ${JSON.stringify(tokens.space, null, 2)} as const;

export type Space = typeof space;
`;
}

function createTypographyFileContent(
  tokens: z.infer<typeof registryTokensSchema>,
) {
  return `import { Platform, TextStyle } from "react-native";

type TextVariant = {
  fontSize: number;
  fontWeight?: TextStyle["fontWeight"];
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

const androidTypography: Typography = {
  variants: ${JSON.stringify(tokens.typography.android.variants, null, 2)}
};

const iosTypography: Typography = {
  variants: ${JSON.stringify(tokens.typography.ios.variants, null, 2)}
};

export const typography = Platform.select<Typography>({
  android: androidTypography,
  ios: iosTypography,
  default: iosTypography,
});
`;
}

function createThemesFileContent() {
  return `import { Colors, lightThemeColors, darkThemeColors } from "./tokens/colors";

import { radius, Radius } from "./tokens/radius";
import { space, Space } from "./tokens/space";
import { typography, Typography } from "./tokens/typography";

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
`;
}

function createUnistylesFileContent() {
  return `import { StyleSheet } from "react-native-unistyles";

import { themes, Themes } from "./themes";
import { breakpoints, Breakpoints } from "./tokens/breakpoints";

declare module "react-native-unistyles" {
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
`;
}

const PRIMARY_TO_GRAY: Record<
  (typeof COLORS)[number]['name'],
  (typeof GRAY_COLORS)[number]['name']
> = {
  tomato: 'mauve',
  red: 'mauve',
  ruby: 'mauve',
  crimson: 'mauve',
  pink: 'mauve',
  plum: 'mauve',
  purple: 'mauve',
  violet: 'mauve',

  iris: 'slate',
  indigo: 'slate',
  blue: 'slate',
  sky: 'slate',
  cyan: 'slate',

  mint: 'sage',
  teal: 'sage',
  jade: 'sage',
  green: 'sage',

  grass: 'olive',
  lime: 'olive',

  yellow: 'sand',
  amber: 'sand',
  orange: 'sand',
  brown: 'sand',

  gold: 'sand',
  bronze: 'sand',

  slate: 'slate',
  gray: 'gray',
  mauve: 'mauve',
  sage: 'sage',
  olive: 'olive',
  sand: 'sand',
};

function getRecommendedGrayColor(
  primaryColor: (typeof COLORS)[number]['name'],
): (typeof GRAY_COLORS)[number]['name'] {
  return PRIMARY_TO_GRAY[primaryColor] || 'slate';
}
