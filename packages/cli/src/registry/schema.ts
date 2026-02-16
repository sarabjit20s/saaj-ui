import z from 'zod';

import { REGISTRY_COLORS } from '@/src/registry/constants';

export const rawConfigSchema = z.strictObject({
  $schema: z.string().optional(),
  aliases: z.object({
    components: z.string(),
    hooks: z.string(),
    ui: z.string(),
    utils: z.string(),
    styles: z.string(),
  }),
});

export const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    cwd: z.string(),
    components: z.string(),
    hooks: z.string(),
    ui: z.string(),
    utils: z.string(),
    styles: z.string(),
  }),
});

export const registryItemTypeSchema = z.enum([
  'registry:ui',
  'registry:component',
  'registry:hook',
  'registry:util',
  'registry:block',
  'registry:file',
]);

export const registryItemFileSchema = z.discriminatedUnion('type', [
  // Target is required for registry:file
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: z.enum(['registry:file']),
    target: z.string(),
  }),
  z.object({
    path: z.string(),
    content: z.string().optional(),
    type: registryItemTypeSchema.exclude(['registry:file']),
    target: z.string().optional(),
  }),
]);

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: registryItemTypeSchema,
  author: z.string().min(2).optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  meta: z.record(z.string(), z.any()).optional(),
  docs: z.string().optional(),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;

export const registrySchema = z.object({
  name: z.string(),
  homepage: z.string(),
  items: z.array(registryItemSchema),
});

export type Registry = z.infer<typeof registrySchema>;

export const registryIndexSchema = z.array(registryItemSchema);

export const registryResolvedItemsTreeSchema = registryItemSchema.pick({
  dependencies: true,
  devDependencies: true,
  files: true,
  docs: true,
});

export const registryColorsSchema = z.record(
  z.enum(REGISTRY_COLORS.map((color) => color.name)),
  z.array(
    z.object({
      scale: z.number(),
      hex: z.string(),
    }),
  ),
);

const typographyVariantSchema = z.object({
  fontSize: z.number(),
  fontWeight: z.string().optional(),
  lineHeight: z.number().optional(),
  letterSpacing: z.number().optional(),
});

const typographyVariantsSchema = z.object({
  displayLg: typographyVariantSchema,
  displayMd: typographyVariantSchema,
  displaySm: typographyVariantSchema,
  displayXs: typographyVariantSchema,
  headlineLg: typographyVariantSchema,
  headlineMd: typographyVariantSchema,
  headlineSm: typographyVariantSchema,
  headlineXs: typographyVariantSchema,
  labelLg: typographyVariantSchema,
  labelMd: typographyVariantSchema,
  labelSm: typographyVariantSchema,
  labelXs: typographyVariantSchema,
  bodyLg: typographyVariantSchema,
  bodyMd: typographyVariantSchema,
  bodySm: typographyVariantSchema,
  bodyXs: typographyVariantSchema,
});

export const registryTokensSchema = z.object({
  breakpoints: z.object({
    xs: z.number(),
    sm: z.number(),
    md: z.number(),
    lg: z.number(),
  }),
  radius: z.object({
    xs: z.number(),
    sm: z.number(),
    md: z.number(),
    lg: z.number(),
    xl: z.number(),
    '2xl': z.number(),
    '3xl': z.number(),
    '4xl': z.number(),
    none: z.number(),
    full: z.number(),
  }),
  space: z.object({
    '2xs': z.number(),
    xs: z.number(),
    sm: z.number(),
    md: z.number(),
    lg: z.number(),
    xl: z.number(),
    '2xl': z.number(),
    '3xl': z.number(),
    '4xl': z.number(),
    '5xl': z.number(),
    '6xl': z.number(),
    '7xl': z.number(),
    '8xl': z.number(),
    '9xl': z.number(),
  }),
  typography: z.object({
    android: z.object({
      variants: typographyVariantsSchema,
    }),
    ios: z.object({
      variants: typographyVariantsSchema,
    }),
  }),
});
