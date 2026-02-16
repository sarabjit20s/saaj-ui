import z from 'zod';
import { Command } from 'commander';
import path from 'path';
import prompts from 'prompts';
import fs from 'fs-extra';
import plist from 'plist';

import { COLORS } from '@/src/registry/constants';
import { logger } from '@/src/utils/logger';
import { handleError } from '@/src/utils/handle-error';
import { preFlightInit } from '@/src/preflights/preflight-init';
import { highlighter } from '@/src/utils/highlighter';
import {
  DEFAULT_COMPONENTS_ALIAS,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SCHEMA_URL,
  DEFAULT_UTILS_ALIAS,
  resolveConfigPaths,
  type Config,
} from '@/src/utils/get-config';
import { rawConfigSchema } from '@/src/registry/schema';
import { spinner } from '@/src/utils/spinner';
import { initializeStyles } from '@/src/utils/initialize-styles';
import { addPluginsToBabelConfig } from '@/src/utils/updaters/update-babel-config';
import { installDependenciesWithPackageManager } from '@/src/utils/install-dependencies';
import { getPackageManager } from '@/src/utils/get-package-manager';
import { ProjectInfo } from '@/src/utils/get-project-info';
import { addComponents } from '@/src/utils/add-components';
import { updateMainEntryFile } from '@/src/utils/updaters/update-main-entry-file';

export const initOptionsSchema = z.object({
  cwd: z.string(),
  name: z.string().optional(),
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
  silent: z.boolean(),
  primaryColor: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return COLORS.find((color) => color.name === val);
        }

        return true;
      },
      {
        message: `Invalid color. Please use '${COLORS.map(
          (color) => color.name,
        ).join("', '")}'`,
      },
    ),
});

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .argument('[components...]', 'names of components to add')
  .option(
    '-p, --primary-color <primary-color>',
    `the primary color to use. (${COLORS.map((color) => color.name).join(', ')})`,
    undefined,
  )
  .option('-y, --yes', 'skip confirmation prompt.', true)
  .option('-d, --defaults,', 'use default configuration.', false)
  .option('-f, --force', 'force overwrite of existing configuration.', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd(),
  )
  .option('-s, --silent', 'mute output.', false)
  .action(async (components, opts) => {
    try {
      // Apply defaults when --defaults flag is set.
      if (opts.defaults) {
        opts.primaryColor = opts.primaryColor || DEFAULT_PRIMARY_COLOR;
      }

      const options = initOptionsSchema.parse({
        ...opts,
        components,
        cwd: path.resolve(opts.cwd),
      });

      await runInit(options);
    } catch (error) {
      handleError(error);
    }
  });

export async function runInit(options: z.infer<typeof initOptionsSchema>) {
  const { projectInfo } = await preFlightInit(options);

  const answers = await promptForConfig(options);

  const rawConfig: z.infer<typeof rawConfigSchema> = {
    $schema: DEFAULT_SCHEMA_URL,
    aliases: {
      components: answers.components,
      utils: answers.utils,
      ui: answers.components.replace(/\/components$/, '/components/ui'),
      hooks: answers.components.replace(/\/components$/, '/hooks'),
      styles: answers.components.replace(/\/components$/, '/styles'),
    },
  };

  const componentSpinner = spinner(`Writing components.json.`)?.start();

  // Write components.json
  await fs.writeFile(
    path.join(options.cwd, 'components.json'),
    JSON.stringify(rawConfig, null, 2),
  );

  componentSpinner?.success();

  const fullConfig = await resolveConfigPaths(options.cwd, rawConfig);

  // Initialize styles
  const stylesSpinner = spinner(`Initializing styles.`)?.start();
  await initializeStyles(
    answers.primaryColor as (typeof COLORS)[number]['name'],
    fullConfig,
  );
  stylesSpinner?.success();

  // Add plugins to babel config
  const babelSpinner = spinner(`Adding plugins to babel.config.js.`)?.start();
  await addPluginsToBabelConfig(projectInfo, fullConfig);
  babelSpinner?.success();

  // Update main entry file (e.g. App.tsx or index.js) to include unistyles import
  const entryFileSpinner = spinner(`Updating main entry file.`)?.start();

  const entryFilename = await updateMainEntryFile(fullConfig);

  if (entryFilename) {
    entryFileSpinner?.success(`Added unistyles import to ${entryFilename}.`);
  } else {
    entryFileSpinner?.info(
      `No main entry file found. Please add ${highlighter.info(`'${fullConfig.aliases.styles}/unistyles'`)} to your main entry file (e.g. App.tsx or index.js).`,
    );
  }

  // Install depenencies
  const installSpinner = spinner(`Installing dependencies.`)?.start();
  await installDependencies(fullConfig.resolvedPaths.cwd);
  installSpinner?.success();

  await updateIconFontsList(projectInfo, options.cwd);

  const components = [...(options.components ?? [])];

  if (components.length) {
    await addComponents(Array.from(new Set(components)), fullConfig, {
      // Init will always overwrite files.
      overwrite: true,
      silent: options.silent,
    });
  }

  await printNextSteps(projectInfo, fullConfig);

  return fullConfig;
}

async function promptForConfig(options: z.infer<typeof initOptionsSchema>) {
  let primaryColor = options.primaryColor || DEFAULT_PRIMARY_COLOR;
  let components = DEFAULT_COMPONENTS_ALIAS;
  let utils = DEFAULT_UTILS_ALIAS;

  if (!options.defaults) {
    const answers = await prompts([
      {
        type: 'select',
        name: 'primaryColor',
        message: `Which color would you like to use as the ${highlighter.info(
          'primary color',
        )}?`,
        choices: COLORS.map((color) => ({
          title: color.label,
          value: color.name,
        })),
      },
      {
        type: 'text',
        name: 'components',
        message: `Configure the import alias for ${highlighter.info('components')}:`,
        initial: components,
      },
      {
        type: 'text',
        name: 'utils',
        message: `Configure the import alias for ${highlighter.info('utils')}:`,
        initial: utils,
      },
    ]);

    primaryColor = answers.primaryColor;
    components = answers.components;
    utils = answers.utils;
  }

  return {
    primaryColor,
    components,
    utils,
  };
}

async function installDependencies(cwd: string) {
  const dependencies = [
    'react-native-unistyles',
    'react-native-nitro-modules',
    'react-native-edge-to-edge',
    'react-native-reanimated',
    'react-native-worklets',
    '@react-native-vector-icons/lucide',
  ];
  const devDependencies = ['babel-plugin-module-resolver'];

  const pm = await getPackageManager();

  await installDependenciesWithPackageManager({
    packageManager: pm,
    dependencies,
    devDependencies: devDependencies,
    cwd,
  });
}

async function updateIconFontsList(projectInfo: ProjectInfo, cwd: string) {
  // Add Lucide icon font name to the ios/{AppName}/Info.plist file.
  if (projectInfo.framework.name === 'react-native') {
    // Get AppName dir name
    const iosDirFiles = await fs.readdir(path.join(cwd, 'ios'));
    const appNameDir = iosDirFiles.find((file) => file.endsWith('.xcodeproj'));
    const appName = appNameDir?.replace('.xcodeproj', '');

    if (appName) {
      const infoPlistPath = path.join(cwd, 'ios', appName, 'Info.plist');
      const xml = await fs.readFile(infoPlistPath, 'utf-8');
      const jsonObj = plist.parse(xml) as any;

      if (jsonObj?.UIAppFonts && Array.isArray(jsonObj.UIAppFonts)) {
        const exists = jsonObj.UIAppFonts.includes('Lucide.ttf');
        if (!exists) {
          jsonObj.UIAppFonts.push('Lucide.ttf');
        }
      } else {
        jsonObj.UIAppFonts = ['Lucide.ttf'];
      }

      const newXml = plist.build(jsonObj);
      await fs.writeFile(infoPlistPath, newXml);
    } else {
      logger.warn(
        `Unable to modify ${highlighter.info(
          'ios/{AppName}/Info.plist',
        )} file. Please add the ${highlighter.info('Lucide.ttf')} value to the ${highlighter.info('UIAppFonts')} key manually.`,
      );
    }
  }
}

async function printNextSteps(projectInfo: ProjectInfo, config: Config) {
  logger.break();
  logger.log(`Next steps:`);

  if (projectInfo.framework.name === 'react-native') {
    logger.log(
      `• Restart Metro with cache reset:\n  ${highlighter.info(
        '`npx react-native start --reset-cache`',
      )}`,
    );
    logger.log(
      `• Build and launch the app:\n  ${highlighter.info(
        '`npx react-native run-ios`',
      )} or ${highlighter.info('`npx react-native run-android`')}`,
    );
  } else if (projectInfo.framework.name === 'expo') {
    const nativeDirsExists =
      (await fs.pathExists(path.join(config.resolvedPaths.cwd, 'android'))) ||
      (await fs.pathExists(path.join(config.resolvedPaths.cwd, 'ios')));

    logger.log(
      `• Generate native project files ${
        nativeDirsExists ? '(using existing native folders)' : '(fresh setup)'
      }:\n  ${highlighter.info(
        nativeDirsExists
          ? '`npx expo prebuild`'
          : '`npx expo prebuild --clean`',
      )}`,
    );
    logger.log(
      `• Build and launch the app:\n  ${highlighter.info(
        '`npx expo run:ios`',
      )} or ${highlighter.info('`npx expo run:android`')}`,
    );
  }
  logger.break();
  logger.log('You can now start adding components:');
  logger.log(`  ${highlighter.info('`saaj add button`')}`);
  logger.break();
}
