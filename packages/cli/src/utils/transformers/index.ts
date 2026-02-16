import fs from 'fs-extra';
import { tmpdir } from 'os';
import path from 'path';
import { Project, ScriptKind, type SourceFile } from 'ts-morph';

import { Config } from '@/src/utils/get-config';
import { transformCleanup } from '@/src/utils/transformers/transform-cleanup';
import { transformImport } from '@/src/utils/transformers/transform-import';

export type TransformOpts = {
  filename: string;
  raw: string;
  config: Config;
};

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile;
  },
) => Promise<Output>;

const project = new Project({
  compilerOptions: {},
});

export async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'));
  return path.join(dir, filename);
}

export async function transform(
  opts: TransformOpts,
  transformers: Transformer[] = [transformImport, transformCleanup],
) {
  const tempFile = await createTempSourceFile(opts.filename);
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  });

  for (const transformer of transformers) {
    await transformer({ sourceFile, ...opts });
  }

  return sourceFile.getFullText();
}
