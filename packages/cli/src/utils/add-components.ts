import z from 'zod';

import { resolveRegistryTree } from '@/src/registry/resolver';
import { Config } from '@/src/utils/get-config';
import { handleError } from '@/src/utils/handle-error';
import { spinner } from '@/src/utils/spinner';
import { registryItemFileSchema } from '@/src/registry/schema';
import { isSafeTarget } from '@/src/utils/is-safe-target';
import { updateDependencies } from '@/src/utils/updaters/update-dependencies';
import { updateFiles } from '@/src/utils/updaters/update-files';
import { logger } from '@/src/utils/logger';

export async function addComponents(
  components: string[],
  config: Config,
  options: {
    overwrite?: boolean;
    silent?: boolean;
    path?: string;
  },
) {
  if (!components.length) {
    return;
  }

  const registrySpinner = spinner(`Checking registry.`, {
    silent: options.silent,
  })?.start();

  let tree = await resolveRegistryTree(components, config);

  if (!tree) {
    registrySpinner?.error();
    return handleError(new Error('Failed to fetch components from registry.'));
  }

  try {
    validateFilesTarget(tree.files ?? [], config.resolvedPaths.cwd);
  } catch (error) {
    registrySpinner?.error();
    return handleError(error);
  }

  registrySpinner?.success();

  await updateDependencies(tree.dependencies, tree.devDependencies, config, {
    silent: options.silent,
  });

  await updateFiles(tree.files, config, {
    overwrite: options.overwrite,
    silent: options.silent,
    path: options.path,
  });

  if (tree.docs) {
    logger.info(tree.docs);
  }
}

function validateFilesTarget(
  files: z.infer<typeof registryItemFileSchema>[],
  cwd: string,
) {
  for (const file of files) {
    if (!file?.target) {
      continue;
    }

    if (!isSafeTarget(file.target, cwd)) {
      throw new Error(
        `We found an unsafe file path "${file.target} in the registry item. Installation aborted.`,
      );
    }
  }
}
