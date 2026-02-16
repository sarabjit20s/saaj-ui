import z from 'zod';
import path, { basename } from 'path';
import fs from 'fs-extra';
import prompts from 'prompts';

import { RegistryItem, registryItemFileSchema } from '@/src/registry/schema';
import { Config } from '@/src/utils/get-config';
import { getProjectInfo, ProjectInfo } from '@/src/utils/get-project-info';
import { spinner } from '@/src/utils/spinner';
import { transform } from '@/src/utils/transformers';
import { isContentSame } from '@/src/utils/compare';
import { highlighter } from '@/src/utils/highlighter';
import { logger } from '@/src/utils/logger';

export async function updateFiles(
  files: RegistryItem['files'],
  config: Config,
  options: {
    overwrite?: boolean;
    force?: boolean;
    silent?: boolean;
    rootSpinner?: ReturnType<typeof spinner>;
    path?: string;
  },
) {
  if (!files?.length) {
    return {
      filesCreated: [],
      filesUpdated: [],
      filesSkipped: [],
    };
  }

  options = {
    overwrite: false,
    force: false,
    silent: false,
    ...options,
  };

  const filesCreatedSpinner = spinner(`Updating files.`, {
    silent: options.silent,
  })?.start();

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd);

  const filesCreated: string[] = [];
  const filesUpdated: string[] = [];
  const filesSkipped: string[] = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    if (!file.content) {
      continue;
    }

    let filePath = resolveFilePath(file, config, {
      isSrcDir: projectInfo.isSrcDir,
      framework: projectInfo.framework.name,
      commonRoot: findCommonRoot(
        files.map((f) => f.path),
        file.path,
      ),
      path: options.path,
      fileIndex: index,
    });

    if (!filePath) {
      continue;
    }

    const fileName = basename(file.path);
    const targetDir = path.dirname(filePath);

    const existingFile = fs.existsSync(filePath);

    // Check if the path exists and is a directory - we can't write to directories.
    if (existingFile && fs.statSync(filePath).isDirectory()) {
      throw new Error(
        `Cannot write to ${filePath}: path exists and is a directory. Please provide a file path instead.`,
      );
    }

    // Run our transformers.
    // Skip transformers for universal item files (registry:file and registry:item)
    // to preserve their original content as they're meant to be framework-agnostic
    const isUniversalItemFile = file.type === 'registry:file';

    const content = isUniversalItemFile
      ? file.content
      : await transform({
          filename: file.path,
          raw: file.content,
          config,
        });

    // Skip the file if it already exists and the content is the same.
    if (existingFile) {
      const existingFileContent = await fs.readFile(filePath, 'utf-8');

      if (isContentSame(existingFileContent, content)) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath));
        continue;
      }
    }

    // Overwrite prompt
    if (existingFile && !options.overwrite) {
      filesCreatedSpinner?.stop();
      if (options.rootSpinner) {
        options.rootSpinner.stop();
      }
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: `The file ${highlighter.info(
          fileName,
        )} already exists. Would you like to overwrite?`,
        initial: false,
      });

      if (!overwrite) {
        filesSkipped.push(path.relative(config.resolvedPaths.cwd, filePath));
        if (options.rootSpinner) {
          options.rootSpinner.start();
        }
        continue;
      }
      filesCreatedSpinner?.start();
      if (options.rootSpinner) {
        options.rootSpinner.start();
      }
    }

    // Create the target directory if it doesn't exist.
    if (!fs.existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true });
    }

    await fs.writeFile(filePath, content, 'utf-8');

    // Handle file creation logging
    if (!existingFile) {
      filesCreated.push(path.relative(config.resolvedPaths.cwd, filePath));
    } else {
      filesUpdated.push(path.relative(config.resolvedPaths.cwd, filePath));
    }
  }

  const hasUpdatedFiles = filesCreated.length || filesUpdated.length;
  if (!hasUpdatedFiles && !filesSkipped.length) {
    filesCreatedSpinner?.info('No files updated.');
  }

  if (filesCreated.length) {
    filesCreatedSpinner?.success(
      `Created ${filesCreated.length} ${
        filesCreated.length === 1 ? 'file' : 'files'
      }:`,
    );
    if (!options.silent) {
      for (const file of filesCreated) {
        logger.log(`  - ${file}`);
      }
    }
  } else {
    filesCreatedSpinner?.stop();
  }

  if (filesUpdated.length) {
    spinner(
      `Updated ${filesUpdated.length} ${
        filesUpdated.length === 1 ? 'file' : 'files'
      }:`,
      {
        silent: options.silent,
      },
    )?.info();
    if (!options.silent) {
      for (const file of filesUpdated) {
        logger.log(`  - ${file}`);
      }
    }
  }

  if (filesSkipped.length) {
    spinner(
      `Skipped ${filesSkipped.length} ${
        filesUpdated.length === 1 ? 'file' : 'files'
      }:`,
      {
        silent: options.silent,
      },
    )?.info();
    if (!options.silent) {
      for (const file of filesSkipped) {
        logger.log(`  - ${file}`);
      }
    }
  }

  if (!options.silent) {
    logger.break();
  }
}

export function resolveFilePath(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config,
  options: {
    isSrcDir?: boolean;
    commonRoot?: string;
    framework?: ProjectInfo['framework']['name'];
    path?: string;
    fileIndex?: number;
  },
) {
  // Handle custom path if provided.
  if (options.path) {
    const resolvedPath = path.isAbsolute(options.path)
      ? options.path
      : path.join(config.resolvedPaths.cwd, options.path);

    const isFilePath = /\.[^/\\]+$/.test(resolvedPath);

    if (isFilePath) {
      // We'll only use the custom path for the first file.
      // This is for registry items with multiple files.
      if (options.fileIndex === 0) {
        return resolvedPath;
      }
    } else {
      // If the custom path is a directory,
      // We'll place all files in the directory.
      const fileName = path.basename(file.path);
      return path.join(resolvedPath, fileName);
    }
  }

  if (file.target) {
    if (file.target.startsWith('~/')) {
      return path.join(config.resolvedPaths.cwd, file.target.replace('~/', ''));
    }

    let target = file.target;

    return options.isSrcDir
      ? path.join(config.resolvedPaths.cwd, 'src', target.replace('src/', ''))
      : path.join(config.resolvedPaths.cwd, target.replace('src/', ''));
  }

  const targetDir = resolveFileTargetDirectory(file, config);

  const relativePath = resolveNestedFilePath(file.path, targetDir);
  return path.join(targetDir, relativePath);
}

function resolveFileTargetDirectory(
  file: z.infer<typeof registryItemFileSchema>,
  config: Config,
) {
  if (file.type === 'registry:ui') {
    return config.resolvedPaths.ui;
  }

  if (file.type === 'registry:util') {
    return config.resolvedPaths.utils;
  }

  if (file.type === 'registry:block' || file.type === 'registry:component') {
    return config.resolvedPaths.components;
  }

  if (file.type === 'registry:hook') {
    return config.resolvedPaths.hooks;
  }

  return config.resolvedPaths.components;
}

export function resolveNestedFilePath(
  filePath: string,
  targetDir: string,
): string {
  // Normalize paths by removing leading/trailing slashes
  const normalizedFilePath = filePath.replace(/^\/|\/$/g, '');
  const normalizedTargetDir = targetDir.replace(/^\/|\/$/g, '');

  // Split paths into segments
  const fileSegments = normalizedFilePath.split('/');
  const targetSegments = normalizedTargetDir.split('/');

  // Find the last matching segment from targetDir in filePath
  const lastTargetSegment = targetSegments[targetSegments.length - 1];
  const commonDirIndex = fileSegments.findIndex(
    (segment) => segment === lastTargetSegment,
  );

  if (commonDirIndex === -1) {
    // Return just the filename if no common directory is found
    return fileSegments[fileSegments.length - 1];
  }

  // Return everything after the common directory
  return fileSegments.slice(commonDirIndex + 1).join('/');
}

export function findCommonRoot(paths: string[], needle: string): string {
  // Remove leading slashes for consistent handling
  const normalizedPaths = paths.map((p) => p.replace(/^\//, ''));
  const normalizedNeedle = needle.replace(/^\//, '');

  // Get the directory path of the needle by removing the file name
  const needleDir = normalizedNeedle.split('/').slice(0, -1).join('/');

  // If needle is at root level, return empty string
  if (!needleDir) {
    return '';
  }

  // Split the needle directory into segments
  const needleSegments = needleDir.split('/');

  // Start from the full path and work backwards
  for (let i = needleSegments.length; i > 0; i--) {
    const testPath = needleSegments.slice(0, i).join('/');
    // Check if this is a common root by verifying if any other paths start with it
    const hasRelatedPaths = normalizedPaths.some(
      (path) => path !== normalizedNeedle && path.startsWith(testPath + '/'),
    );
    if (hasRelatedPaths) {
      return '/' + testPath; // Add leading slash back for the result
    }
  }

  // If no common root found with other files, return the parent directory of the needle
  return '/' + needleDir; // Add leading slash back for the result
}
