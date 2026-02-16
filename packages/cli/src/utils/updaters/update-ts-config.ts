import fs from 'fs-extra';

export async function addImportAliasToTsConfig(
  aliasPrefix: string,
  isSrcDir: boolean,
  tsConfigPath: string,
) {
  try {
    const tsConfigObj = await fs.readJSON(tsConfigPath, 'utf-8');

    const compilerOptions = tsConfigObj?.compilerOptions || {};

    if (!compilerOptions?.paths) {
      compilerOptions.paths = {};
    }

    compilerOptions.paths[`${aliasPrefix}/*`] = isSrcDir
      ? ['./src/*']
      : ['./*'];

    const newConfig = {
      ...tsConfigObj,
      compilerOptions,
    };

    await fs.writeFile(
      tsConfigPath,
      JSON.stringify(newConfig, null, 2),
      'utf-8',
    );
  } catch (error) {
    throw error;
  }
}
