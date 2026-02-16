import { execa } from 'execa';
import { AgentName } from 'package-manager-detector';

export async function installDependenciesWithPackageManager({
  packageManager,
  dependencies,
  devDependencies,
  cwd,
  flag,
}: {
  packageManager: AgentName | 'expo';
  dependencies: string[];
  devDependencies: string[];
  cwd: string;
  flag?: string;
}) {
  if (packageManager === 'npm') {
    return installWithNpm(dependencies, devDependencies, cwd, flag);
  }

  if (packageManager === 'deno') {
    return installWithDeno(dependencies, devDependencies, cwd);
  }

  if (packageManager === 'expo') {
    return installWithExpo(dependencies, devDependencies, cwd);
  }

  if (dependencies?.length) {
    await execa(packageManager, ['add', ...dependencies], {
      cwd,
    });
  }

  if (devDependencies?.length) {
    await execa(packageManager, ['add', '-D', ...devDependencies], { cwd });
  }
}

async function installWithNpm(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
  flag?: string,
) {
  if (dependencies.length) {
    await execa(
      'npm',
      ['install', ...(flag ? [`--${flag}`] : []), ...dependencies],
      { cwd },
    );
  }

  if (devDependencies.length) {
    await execa(
      'npm',
      ['install', ...(flag ? [`--${flag}`] : []), '-D', ...devDependencies],
      { cwd },
    );
  }
}

async function installWithDeno(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
) {
  if (dependencies?.length) {
    await execa('deno', ['add', ...dependencies.map((dep) => `npm:${dep}`)], {
      cwd,
    });
  }

  if (devDependencies?.length) {
    await execa(
      'deno',
      ['add', '-D', ...devDependencies.map((dep) => `npm:${dep}`)],
      { cwd },
    );
  }
}

async function installWithExpo(
  dependencies: string[],
  devDependencies: string[],
  cwd: string,
) {
  if (dependencies.length) {
    await execa('npx', ['expo', 'install', ...dependencies], { cwd });
  }

  if (devDependencies.length) {
    await execa('npx', ['expo', 'install', '-- -D', ...devDependencies], {
      cwd,
    });
  }
}
