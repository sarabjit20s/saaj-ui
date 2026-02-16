import path from 'path';
import z from 'zod';
import fs from 'fs-extra';
import prompts from 'prompts';

import { initOptionsSchema } from '@/src/commands/init';
import * as ERRORS from '@/src/utils/errors';
import { spinner } from '@/src/utils/spinner';
import { logger } from '@/src/utils/logger';
import { highlighter } from '@/src/utils/highlighter';
import { getProjectInfo } from '@/src/utils/get-project-info';
import { addImportAliasToTsConfig } from '@/src/utils/updaters/update-ts-config';

export async function preFlightInit(
  options: z.infer<typeof initOptionsSchema>,
) {
  const errors: Record<string, boolean> = {};

  // Ensure target directory exists.
  // Check for empty project. We assume if no package.json exists, the project is empty.
  if (
    !fs.existsSync(options.cwd) ||
    !fs.existsSync(path.resolve(options.cwd, 'package.json'))
  ) {
    errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT] = true;
    logger.break();
    logger.error(
      `Could not find a ${highlighter.info(
        'package.json',
      )} file in the current directory or an empty project. Please create a react-native project first and then run ${highlighter.info(
        'init',
      )} again.`,
    );
    logger.break();
    process.exit(1);
  }

  const projectSpinner = spinner(`Preflight checks.`)?.start();

  // Check for existing components.json
  if (
    fs.existsSync(path.resolve(options.cwd, 'components.json')) &&
    !options.force
  ) {
    projectSpinner?.error();
    logger.break();
    logger.error(
      `A ${highlighter.info(
        'components.json',
      )} file already exists at ${highlighter.info(
        options.cwd,
      )}.\nTo start over, remove the ${highlighter.info(
        'components.json',
      )} file and run ${highlighter.info('init')} again.`,
    );
    logger.break();
    process.exit(1);
  }

  projectSpinner?.success();

  // Verify framework.
  const frameworkSpinner = spinner(`Verifying framework.`)?.start();
  let projectInfo = await getProjectInfo(options.cwd);

  if (projectInfo.framework.name === 'manual') {
    errors[ERRORS.UNSUPPORTED_FRAMEWORK] = true;
    frameworkSpinner?.error();
    logger.break();

    if (projectInfo.framework.links.installation) {
      logger.error(
        `We could not detect a supported framework at ${highlighter.info(
          options.cwd,
        )}.\n` +
          `Visit ${highlighter.info(
            projectInfo.framework.links.installation,
          )} to manually configure your project.\nOnce configured, you can use the cli to add components.`,
      );
    }
    logger.break();
    process.exit(1);
  }

  frameworkSpinner?.success(
    `Verifying framework. Found ${highlighter.info(
      projectInfo.framework.label,
    )}.`,
  );

  // Validate import alias
  const tsConfigSpinner = spinner(`Validating import alias.`)?.start();

  if (!projectInfo.aliasPrefix) {
    tsConfigSpinner?.stop();
    logger.info(`No import alias found in your tsconfig.json file.`);

    const aliasPrefix = await promptForImportAliasPrefix();

    tsConfigSpinner?.start(
      `Adding import alias ${highlighter.info(aliasPrefix)} to tsconfig.json.`,
    );

    try {
      await addImportAliasToTsConfig(
        aliasPrefix,
        projectInfo.isSrcDir,
        path.join(options.cwd, 'tsconfig.json'),
      );
      const newProjectInfo = await getProjectInfo(options.cwd);
      projectInfo = newProjectInfo;
      tsConfigSpinner?.success(
        `Successfully added import alias ${highlighter.info(aliasPrefix)} to tsconfig.json.`,
      );
    } catch (error) {
      const newProjectInfo = await getProjectInfo(options.cwd);
      if (!newProjectInfo.aliasPrefix) {
        errors[ERRORS.IMPORT_ALIAS_MISSING] = true;
        tsConfigSpinner?.error();
        logger.break();
        logger.error(
          `Unable to add an import alias in your ${highlighter.info(
            'tsconfig.json',
          )} file. Please add one manually and run ${highlighter.info(
            'init',
          )} again.`,
        );
        logger.break();
        process.exit(1);
      }
    }
  }

  tsConfigSpinner?.success();

  return {
    errors,
    projectInfo,
  };
}

async function promptForImportAliasPrefix() {
  const answers = await prompts([
    {
      type: 'text',
      name: 'aliasPrefix',
      message:
        'What would you like your import alias prefix to be? (e.g. @ or ~)',
      initial: '@',
    },
  ]);

  return answers.aliasPrefix;
}
