import { Config } from '@/src/utils/get-config';
import { Transformer } from '@/src/utils/transformers';

export const transformImport: Transformer = async ({ sourceFile, config }) => {
  if (!['.tsx', '.ts'].includes(sourceFile.getExtension())) {
    return sourceFile;
  }

  for (const specifier of sourceFile.getImportStringLiterals()) {
    const updated = updateImportAliases(specifier.getLiteralValue(), config);

    specifier.setLiteralValue(updated);
  }

  return sourceFile;
};

function updateImportAliases(moduleSpecifier: string, config: Config) {
  if (!moduleSpecifier.startsWith('@/')) {
    return moduleSpecifier;
  }

  // Handle '@/registry/ui' import
  const uiRegExp = /@\/registry\/ui/;

  if (moduleSpecifier.match(uiRegExp)) {
    return moduleSpecifier.replace(uiRegExp, config.aliases.ui);
  }

  // Handle '@/registry/components' import
  const componentsRegExp = /@\/registry\/components/;

  if (moduleSpecifier.match(componentsRegExp)) {
    return moduleSpecifier.replace(componentsRegExp, config.aliases.components);
  }

  // Handle '@/registry/hooks' import
  const hooksRegExp = /@\/registry\/hooks/;

  if (moduleSpecifier.match(hooksRegExp)) {
    return moduleSpecifier.replace(hooksRegExp, config.aliases.hooks);
  }

  // Handle '@/registry/utils' import
  const utilsRegExp = /@\/registry\/utils/;

  if (moduleSpecifier.match(utilsRegExp)) {
    return moduleSpecifier.replace(utilsRegExp, config.aliases.utils);
  }

  // Handle '@/styles' import
  const stylesRegExp = /@\/styles/;

  if (moduleSpecifier.match(stylesRegExp)) {
    return moduleSpecifier.replace(stylesRegExp, config.aliases.styles);
  }

  return moduleSpecifier.replace(
    /^@\/registry\/[^/]+/,
    config.aliases.components,
  );
}
