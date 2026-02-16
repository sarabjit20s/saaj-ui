import z from 'zod';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';

import { logger } from '@/src/utils/logger';
import { handleError } from '@/src/utils/handle-error';
import { spinner } from '@/src/utils/spinner';
import { highlighter } from '@/src/utils/highlighter';
import { registryItemSchema, registrySchema } from '@/src/registry/schema';
import { REGISTRY_ITEM_SCHEMA_URL } from '@/src/registry/constants';

export const buildOptionsSchema = z.object({
  cwd: z.string(),
  registryFile: z.string(),
  outputDir: z.string(),
  verbose: z.boolean().optional().default(false),
});

export const build = new Command()
  .name('registry:build')
  .description('builds the registry')
  .argument('[registry]', 'path to registry.json file', './registry.json')
  .option(
    '-o, --output <path>',
    'destination directory for json files',
    './public/r',
  )
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current working directory',
    process.cwd(),
  )
  .option('-v, --verbose', 'verbose output', false)
  .action(async (registryFile: string, opts) => {
    await buildRegistry({
      registryFile,
      cwd: opts.cwd,
      outputDir: opts.output,
      verbose: opts.verbose,
    });
  });

async function buildRegistry(opts: z.infer<typeof buildOptionsSchema>) {
  try {
    const options = buildOptionsSchema.parse(opts);

    const cwd = path.resolve(options.cwd);
    const registryFile = path.resolve(cwd, options.registryFile);
    const outputDir = path.resolve(cwd, options.outputDir);

    // Ensure the registry file exists
    if (!fs.existsSync(registryFile)) {
      logger.error(
        `We could not find a registry file at ${highlighter.info(registryFile)}`,
      );
      logger.break();
      process.exit(1);
    }

    // Validate the registry file
    const content = await fs.promises.readFile(registryFile, 'utf-8');

    const result = registrySchema.safeParse(JSON.parse(content));

    if (!result.success) {
      logger.error(
        `Invalid registry file found at ${highlighter.info(registryFile)}.`,
      );
      logger.break();
      process.exit(1);
    }

    const registry = result.data;

    const buildSpinner = spinner('Building registry...')?.start();

    // Create output directory if it doesn't exist.
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Loop through the registry items and remove duplicates files i.e. same path
    for (const registryItem of registry.items) {
      // Deduplicate files
      registryItem.files = registryItem.files?.filter(
        (file, index) =>
          registryItem.files?.findIndex((f) => f.path === file.path) === index,
      );

      // Deduplicate dependencies
      if (registryItem.dependencies) {
        registryItem.dependencies = registryItem.dependencies?.filter(
          (dep, index) =>
            registryItem.dependencies?.findIndex((d) => d === dep) === index,
        );
      }

      // Deduplicate devDependencies
      if (registryItem.devDependencies) {
        registryItem.devDependencies = registryItem.devDependencies?.filter(
          (dep, index) =>
            registryItem.devDependencies?.findIndex((d) => d === dep) === index,
        );
      }
    }

    for (const registryItem of registry.items) {
      if (!registryItem.files) {
        continue;
      }

      buildSpinner && (buildSpinner.text = `Building ${registryItem.name}...`);

      // Add the schema to the registry item
      registryItem.$schema = REGISTRY_ITEM_SCHEMA_URL;

      // Loop through the files and read the content
      for (const file of registryItem.files) {
        const absPath = path.resolve(cwd, file.path);
        try {
          const stat = await fs.promises.stat(file.path);
          if (!stat.isFile()) {
            continue;
          }
          file.content = await fs.promises.readFile(absPath, 'utf-8');
        } catch (err) {
          logger.error('Error reading file in registry build:', absPath, err);
          continue;
        }
      }

      // Validate the registry item
      const result = registryItemSchema.safeParse(registryItem);
      if (!result.success) {
        logger.error(
          `Invalid registry item found for ${highlighter.info(
            registryItem.name,
          )}.`,
        );
        continue;
      }

      // Write the registry item to the output directory
      await fs.promises.writeFile(
        path.join(outputDir, `${registryItem.name}.json`),
        JSON.stringify(result.data, null, 2),
      );
    }

    // Copy registry.json to the output directory
    await fs.promises.copyFile(
      registryFile,
      path.join(outputDir, 'registry.json'),
    );

    buildSpinner?.success('Building registry.');

    if (options.verbose) {
      spinner(
        `The registry has ${highlighter.info(
          registry.items.length.toString(),
        )} items:`,
      )?.success();

      for (const item of registry.items) {
        logger.log(`  - ${item.name} (${highlighter.info(item.type)})`);
        for (const file of item.files ?? []) {
          logger.log(`    - ${file.path}`);
        }
      }
    }
  } catch (error) {
    logger.break();
    handleError(error);
  }
}
