import { Command } from 'commander';
import z from 'zod';
import path from 'path';
import prompts from 'prompts';

import { handleError } from '@/src/utils/handle-error';
import { preFlightAdd } from '@/src/preflights/preflight-add';
import { addComponents } from '@/src/utils/add-components';
import { getRegistryIndex } from '@/src/registry/api';
import { logger } from '@/src/utils/logger';

export const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  path: z.string().optional(),
  overwrite: z.boolean(),
  all: z.boolean(),
  silent: z.boolean(),
});

export const add = new Command()
  .name('add')
  .description('add components to the project')
  .argument('[components...]', 'components to add')
  .option('-o, --overwrite', 'overwrite existing files', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory',
    process.cwd(),
  )
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to.')
  .option('-s, --silent', 'mute output', false)
  .action(async (components, opts) => {
    try {
      const options = addOptionsSchema.parse({
        ...opts,
        components,
        cwd: path.resolve(opts.cwd),
      });

      const { config } = await preFlightAdd(options);

      if (!options.components?.length) {
        options.components = await promptForRegistryComponents(options);
      }

      await addComponents(options.components, config, {
        overwrite: options.overwrite,
        silent: options.silent,
        path: options.path,
      });
    } catch (error) {
      handleError(error);
    }
  });

async function promptForRegistryComponents(
  options: z.infer<typeof addOptionsSchema>,
) {
  const registryIndex = await getRegistryIndex();
  if (!registryIndex) {
    handleError(new Error('Failed to fetch registry index.'));
    return [];
  }

  if (options.all) {
    return registryIndex.map((item) => item.name);
  }

  if (options.components?.length) {
    return options.components;
  }

  const { components } = await prompts({
    type: 'multiselect',
    name: 'components',
    message: 'Which components would you like to add?',
    hint: 'Space to select. A to toggle all. Enter to submit.',
    instructions: false,
    choices: registryIndex.map((item) => ({
      title: item.name,
      value: item.name,
      selected: options.components?.includes(item.name),
    })),
  });

  if (!components?.length) {
    logger.warn('No components selected. Exiting.');
    logger.break();
    process.exit(1);
  }

  const result = z.array(z.string()).safeParse(components);
  if (!result.success) {
    logger.error('');
    handleError(new Error('Something went wrong. Please try again.'));
    return [];
  }
  return result.data;
}
