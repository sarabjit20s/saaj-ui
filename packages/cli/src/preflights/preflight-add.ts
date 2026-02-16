import z from 'zod';
import path from 'path';
import fs from 'fs-extra';

import { addOptionsSchema } from '@/src/commands/add';
import { highlighter } from '@/src/utils/highlighter';
import { logger } from '@/src/utils/logger';
import { spinner } from '@/src/utils/spinner';
import { rawConfigSchema } from '@/src/registry/schema';
import { getConfig } from '@/src/utils/get-config';

export async function preFlightAdd(options: z.infer<typeof addOptionsSchema>) {
  const preFlighSpinner = spinner(`Preflight checks.`)?.start();

  const componentsJsonPath = path.resolve(options.cwd, 'components.json');

  const exists = await fs.exists(componentsJsonPath);

  // Ensure components.json exists
  if (!exists) {
    preFlighSpinner?.error();
    logger.break();
    logger.error(
      `Could not find a ${highlighter.info(
        'components.json',
      )} file in the current directory. Please run ${highlighter.info(
        'init',
      )} first and then run ${highlighter.info('add')} again.`,
    );
    logger.break();
    process.exit(1);
  }

  // Validate existing components.json
  const content = await fs.readJSON(componentsJsonPath, 'utf-8');

  const result = rawConfigSchema.safeParse(content);

  const config = await getConfig(options.cwd);

  if (result.error || !config) {
    preFlighSpinner?.error();
    logger.break();
    logger.error(
      `An invalid ${highlighter.info(
        'components.json',
      )} file was found at ${highlighter.info(
        options.cwd,
      )}.\nBefore you can add components, you must create a valid ${highlighter.info(
        'components.json',
      )} file by running the ${highlighter.info('init')} command.`,
    );
    logger.break();
    process.exit(1);
  }

  preFlighSpinner?.success();

  return {
    config,
  };
}
