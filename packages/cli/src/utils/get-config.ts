import { cosmiconfig } from 'cosmiconfig';
import { loadConfig } from 'tsconfig-paths';
import z from 'zod';

import { configSchema, rawConfigSchema } from '../registry/schema';
import { resolveImport } from './resolve-import';
import type { COLORS } from '@/src/registry/constants';

export const DEFAULT_SCHEMA_URL = 'https://saaj-ui.vercel.app/schema.json';
export const DEFAULT_COMPONENTS_ALIAS = '@/components';
export const DEFAULT_UI_COMPONENTS_ALIAS = '@/components/ui';
export const DEFAULT_HOOKS_ALIAS = '@/hooks';
export const DEFAULT_UTILS_ALIAS = '@/utils';
export const DEFAULT_STYLES_ALIAS = '@/styles';
export const DEFAULT_PRIMARY_COLOR: (typeof COLORS)[number]['name'] = 'blue';

export const explorer = cosmiconfig('components', {
  searchPlaces: ['components.json'],
});

export type Config = z.infer<typeof configSchema>;

export async function getConfig(cwd: string) {
  try {
    const result = await explorer.search(cwd);

    if (!result || !result.config) {
      return;
    }

    const config = rawConfigSchema.parse(result.config);

    return await resolveConfigPaths(cwd, config);
  } catch (error) {
    throw error;
  }
}

export async function resolveConfigPaths(
  cwd: string,
  config: z.infer<typeof rawConfigSchema>,
) {
  // Read tsconfig.json
  const tsConfig = await loadConfig(cwd);

  if (tsConfig.resultType === 'failed') {
    throw new Error(`Failed to load tsconfig.json. ${tsConfig.message}`);
  }

  return configSchema.parse({
    ...config,
    resolvedPaths: {
      cwd,
      components: await resolveImport(config.aliases.components, tsConfig),
      ui: await resolveImport(config.aliases.ui, tsConfig),
      hooks: await resolveImport(config.aliases.hooks, tsConfig),
      utils: await resolveImport(config.aliases.utils, tsConfig),
      styles: await resolveImport(config.aliases.styles, tsConfig),
    },
  });
}
