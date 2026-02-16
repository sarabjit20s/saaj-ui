import { fetchRegistry } from '@/src/registry/fetcher';
import { handleError } from '@/src/utils/handle-error';
import {
  registryColorsSchema,
  registryIndexSchema,
  registrySchema,
  registryTokensSchema,
} from '@/src/registry/schema';
import { RegistryParseError } from '@/src/registry/errors';

export async function getRegistryColors() {
  const [lightColors, darkColors] = await fetchRegistry(
    ['colors/light.json', 'colors/dark.json'],
    {
      useCache: true,
    },
  );

  try {
    return {
      light: registryColorsSchema.parse(lightColors),
      dark: registryColorsSchema.parse(darkColors),
    };
  } catch (error) {
    throw new RegistryParseError('colors', error);
  }
}

export async function getRegistryTokens() {
  const [tokens] = await fetchRegistry(['tokens/index.json'], {
    useCache: true,
  });

  try {
    return registryTokensSchema.parse(tokens);
  } catch (error) {
    throw new RegistryParseError('tokens', error);
  }
}

export async function getRegistryIndex() {
  try {
    const [registry] = await fetchRegistry(['registry.json']);

    const result = registrySchema.parse(registry).items;

    return registryIndexSchema.parse(result);
  } catch (error) {
    handleError(error);
  }
}
