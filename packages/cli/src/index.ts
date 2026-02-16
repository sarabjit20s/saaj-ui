#!/usr/bin/env node
import { Command } from 'commander';

import { init } from '@/src/commands/init';
import { add } from '@/src/commands/add';
import { info } from '@/src/commands/info';
import { build as registryBuild } from '@/src/commands/registry/build';
import packageJson from '../package.json';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
  const program = new Command()
    .name('saaj')
    .description(packageJson.description)
    .version(
      packageJson.version || '1.0.0',
      '-v, --version',
      'display the version number',
    );

  program
    .addCommand(init)
    .addCommand(add)
    .addCommand(registryBuild)
    .addCommand(info);

  program.parse();
}

main();
