import { SourceFile } from 'ts-morph';
import { Transformer } from '.';

export const transformCleanup: Transformer = async ({
  sourceFile,
}: {
  sourceFile: SourceFile;
}) => {
  // We don't have to do any cleanup like shadcn does for cn, we are doing
  // this only for the sake of same code structure. We are just returning
  // the source file without any modifications.
  return sourceFile;
};
