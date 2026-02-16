import path from 'path';
import fs from 'fs-extra';
import { loadConfig } from 'tsconfig-paths';

import { Framework, FRAMEWORKS } from './frameworks';
import { getPackageInfo } from './get-package-info';

export type ProjectInfo = {
  framework: Framework;
  isSrcDir: boolean;
  aliasPrefix: string | null;
};

export async function getProjectInfo(cwd: string) {
  const [isSrcDir, aliasPrefix, packageJson] = await Promise.all([
    fs.pathExists(path.resolve(cwd, 'src')),
    getTsConfigAliasPrefix(cwd),
    getPackageInfo(cwd, false),
  ]);

  const projectInfo: ProjectInfo = {
    framework: FRAMEWORKS.manual,
    isSrcDir,
    aliasPrefix,
  };

  // Expo
  if (packageJson?.dependencies?.['expo']) {
    projectInfo.framework = FRAMEWORKS.expo;
    return projectInfo;
  }

  // React Native
  if (packageJson?.dependencies?.['react-native']) {
    projectInfo.framework = FRAMEWORKS['react-native'];
    return projectInfo;
  }

  return projectInfo;
}

export async function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = await loadConfig(cwd);

  if (
    tsConfig?.resultType === 'failed' ||
    !Object.entries(tsConfig?.paths).length
  ) {
    return null;
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (paths.includes('./*') || paths.includes('./src/*')) {
      return alias.replace(/\/\*$/, '') ?? null;
    }
  }

  // Use the first alias as the prefix.
  return Object.keys(tsConfig?.paths)?.[0].replace(/\/\*$/, '') ?? null;
}
