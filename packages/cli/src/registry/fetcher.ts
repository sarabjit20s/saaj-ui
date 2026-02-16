import { REGISTRY_URL } from '@/src/registry/constants';
import {
  RegistryFetchError,
  RegistryForbiddenError,
  RegistryNotFoundError,
  RegistryUnauthorizedError,
} from '@/src/registry/errors';

const registryCache = new Map<string, Promise<any>>();

export function clearRegistryCache() {
  registryCache.clear();
}

export function fetchRegistry(
  paths: string[],
  options: { useCache?: boolean } = {},
) {
  options = {
    useCache: true,
    ...options,
  };

  try {
    const results = Promise.all(
      paths.map(async (path) => {
        const url = resolveRegistryUrl(path);

        // Check cache first if caching is enabled
        if (options.useCache && registryCache.has(url)) {
          return registryCache.get(url);
        }

        const fetchPromise = (async () => {
          const response = await fetch(url);

          if (!response.ok) {
            let messageFromServer = response.statusText || 'Unknown error';

            if (response.status === 401) {
              throw new RegistryUnauthorizedError(url, messageFromServer);
            }

            if (response.status === 404) {
              throw new RegistryNotFoundError(url, messageFromServer);
            }

            if (response.status === 403) {
              throw new RegistryForbiddenError(url, messageFromServer);
            }

            throw new RegistryFetchError(
              url,
              response.status,
              messageFromServer,
            );
          }

          return response.json();
        })();

        if (options.useCache) {
          registryCache.set(url, fetchPromise);
        }

        return fetchPromise;
      }),
    );
    return results;
  } catch (error) {
    throw error;
  }
}

function resolveRegistryUrl(path: string) {
  return `${REGISTRY_URL}/${path}`;
}
