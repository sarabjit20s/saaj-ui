import { RegistryItem } from '@/src/registry/schema';
import { Config } from '@/src/utils/get-config';
import { getPackageInfo } from '@/src/utils/get-package-info';
import { getPackageManager } from '@/src/utils/get-package-manager';
import { spinner } from '@/src/utils/spinner';
import { installDependenciesWithPackageManager } from '@/src/utils/install-dependencies';

export async function updateDependencies(
  dependencies: RegistryItem['dependencies'],
  devDependencies: RegistryItem['devDependencies'],
  config: Config,
  options: {
    silent?: boolean;
  },
) {
  dependencies = Array.from(new Set(dependencies));
  devDependencies = Array.from(new Set(devDependencies));

  if (!dependencies?.length && !devDependencies?.length) {
    return;
  }

  options = {
    silent: false,
    ...options,
  };

  const dependenciesSpinner = spinner(`Installing dependencies.`, {
    silent: options.silent,
  })?.start();

  const packageManager = await getUpdateDependenciesPackageManager(config);

  await installDependenciesWithPackageManager({
    packageManager,
    dependencies,
    devDependencies,
    cwd: config.resolvedPaths.cwd,
  });

  dependenciesSpinner?.success();
}

async function getUpdateDependenciesPackageManager(config: Config) {
  const expoVersion = getPackageInfo(config.resolvedPaths.cwd, false)
    ?.dependencies?.expo;

  if (expoVersion) {
    // Ensures package versions match the React Native version.
    // https://docs.expo.dev/more/expo-cli/#install
    return 'expo';
  }

  return await getPackageManager();
}
