import path from 'path';
import fs from 'fs-extra';
import { Project, ScriptKind } from 'ts-morph';

import { Config } from '@/src/utils/get-config';
import { getPackageInfo } from '@/src/utils/get-package-info';
import { createTempSourceFile } from '@/src/utils/transformers';

export async function updateMainEntryFile(config: Config) {
  const packageInfo = getPackageInfo(config.resolvedPaths.cwd);
  if (!packageInfo) {
    return;
  }

  const isExpoRouterProject = !!packageInfo.dependencies?.['expo-router'];

  if (isExpoRouterProject) {
    return await updateExpoRouterMainEntryFile(config);
  }

  const isExpoProject = !!packageInfo.dependencies?.expo;

  if (isExpoProject) {
    return await updateExpoMainEntryFile(config);
  }

  return await updateReactNativeMainEntryFile(config);
}

const project = new Project({
  compilerOptions: {},
});

async function updateExpoRouterMainEntryFile(config: Config) {
  const packageInfo = getPackageInfo(config.resolvedPaths.cwd);
  if (!packageInfo) {
    return;
  }

  const isExpoRouterProject = !!packageInfo.dependencies?.['expo-router'];
  if (!isExpoRouterProject) {
    return;
  }

  const entryFilename = 'index.ts';
  const entryFilePath = path.join(config.resolvedPaths.cwd, entryFilename);
  const entryFileExists = await fs.pathExists(entryFilePath);

  const expoRouterEntryPath = 'expo-router/entry';
  const unistylesImportPath = `${config.aliases.styles}/unistyles`;

  if (entryFileExists) {
    const content = await fs.readFile(entryFilePath, 'utf-8');

    const tempFile = await createTempSourceFile(entryFilename);
    const sourceFile = project.createSourceFile(tempFile, content, {
      scriptKind: ScriptKind.TS,
    });

    // Handle 'expo-router/entry' import
    const isEntryImportExists =
      !!sourceFile.getImportDeclaration(expoRouterEntryPath);

    if (!isEntryImportExists) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: expoRouterEntryPath,
      });
    }

    // Handle '@/styles/unistyles' import
    const isUnistylesImportExists =
      !!sourceFile.getImportDeclaration(unistylesImportPath);

    if (!isUnistylesImportExists) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: unistylesImportPath,
      });
    }

    if (isEntryImportExists && isUnistylesImportExists) {
      return;
    }

    const newContent = sourceFile.getFullText();

    await fs.writeFile(entryFilePath, newContent, 'utf-8');
  } else {
    const content = `import "${expoRouterEntryPath}";
import "${unistylesImportPath}";
`;

    await fs.writeFile(entryFilePath, content, 'utf-8');
  }

  packageInfo.main = entryFilename;

  await fs.writeJSON(
    path.join(config.resolvedPaths.cwd, 'package.json'),
    packageInfo,
    {
      encoding: 'utf-8',
      spaces: 2,
    },
  );

  return entryFilename;
}

/**
 * For Expo projects that are not using Expo Router
 */
async function updateExpoMainEntryFile(config: Config) {
  const entryFilename = 'App.tsx';
  const entryFilePath = path.join(config.resolvedPaths.cwd, entryFilename);

  if (!(await fs.pathExists(entryFilePath))) {
    return;
  }

  const content = await fs.readFile(entryFilePath, 'utf-8');

  const tempFile = await createTempSourceFile(entryFilename);
  const sourceFile = project.createSourceFile(tempFile, content, {
    scriptKind: ScriptKind.TS,
  });

  const unistylesImportPath = `${config.aliases.styles}/unistyles`;

  // Handle '@/styles/unistyles' import
  const isUnistylesImportExists =
    !!sourceFile.getImportDeclaration(unistylesImportPath);

  if (isUnistylesImportExists) {
    return;
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: unistylesImportPath,
  });

  const newContent = sourceFile.getFullText();

  await fs.writeFile(entryFilePath, newContent, 'utf-8');

  return entryFilename;
}

async function updateReactNativeMainEntryFile(config: Config) {
  const entryFilename = 'index.js';
  const entryFilePath = path.join(config.resolvedPaths.cwd, entryFilename);

  if (!(await fs.pathExists(entryFilePath))) {
    return;
  }

  const content = await fs.readFile(entryFilePath, 'utf-8');

  const unistylesImportPath = `${config.aliases.styles}/unistyles`;

  if (content.includes(unistylesImportPath)) {
    return;
  }

  const lines = content.split('\n');

  // Find last import statement
  const lastImportIndex = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim().startsWith('import '))
    .map(({ index }) => index)
    .pop();

  const importStatement = `import '${unistylesImportPath}';`;

  if (lastImportIndex !== undefined) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
  } else {
    lines.unshift(importStatement);
  }

  const newContent = lines.join('\n');

  await fs.writeFile(entryFilePath, newContent, 'utf-8');

  return entryFilename;
}
