import z from 'zod';
import { createHash } from 'crypto';
import deepmerge from 'deepmerge';
import {
  registryItemSchema,
  registryResolvedItemsTreeSchema,
} from '@/src/registry/schema';
import { fetchRegistry } from '@/src/registry/fetcher';
import { RegistryParseError } from '@/src/registry/errors';
import { Config } from '@/src/utils/get-config';
import { deduplicateFilesByTarget } from '@/src/registry/utils';

const registryItemWithSourceSchema = registryItemSchema.extend({
  _source: z.string().optional(),
});

export async function fetchRegistryItems(
  items: string[],
  options: {
    useCache?: boolean;
  } = {},
) {
  const paths = items.map((item) => `${item}.json`);
  const results = await fetchRegistry(paths, options);

  return results.map((item) => {
    try {
      return registryItemSchema.parse(item);
    } catch (error) {
      throw new RegistryParseError(item, error);
    }
  });
}

export async function resolveRegistryTree(
  names: z.infer<typeof registryItemSchema>['name'][],
  config: Config,
  options: {
    useCache?: boolean;
  } = {},
) {
  options = {
    useCache: true,
    ...options,
  };

  let payload: z.infer<typeof registryItemWithSourceSchema>[] = [];
  let allDependencyItems: z.infer<typeof registryItemWithSourceSchema>[] = [];

  const uniqueNames = Array.from(new Set(names));

  const results = await fetchRegistryItems(uniqueNames, options);

  const resultMap = new Map<string, z.infer<typeof registryItemSchema>>();

  for (let i = 0; i < results.length; i++) {
    if (results[i]) {
      resultMap.set(uniqueNames[i], results[i]);
    }
  }

  for (const [sourceName, item] of Array.from(resultMap.entries())) {
    // Add source tracking
    const itemWithSource: z.infer<typeof registryItemWithSourceSchema> = {
      ...item,
      _source: sourceName,
    };
    payload.push(itemWithSource);

    if (item.registryDependencies) {
      let resolvedDependencies = item.registryDependencies;

      const { items } = await resolveDependenciesRecursively(
        resolvedDependencies,
        options,
        new Set(uniqueNames),
      );

      allDependencyItems.push(...items);
    }
  }

  payload.push(...allDependencyItems);

  if (!payload.length) {
    return null;
  }

  // Build source map for topological sort.
  const sourceMap = new Map<
    z.infer<typeof registryItemWithSourceSchema>,
    string
  >();
  payload.forEach((item) => {
    // Use the _source property if it was added, otherwise use the name.
    const source = item._source || item.name;
    sourceMap.set(item, source);
  });

  // Apply topological sort to ensure dependencies come before dependents.
  payload = topologicalSortRegistryItems(payload, sourceMap);

  // Deduplicate files based on resolved target paths.
  const deduplicatedFiles = await deduplicateFilesByTarget(
    payload.map((item) => item.files ?? []),
    config,
  );

  const parsed = registryResolvedItemsTreeSchema.parse({
    dependencies: deepmerge.all(payload.map((item) => item.dependencies ?? [])),
    devDependencies: deepmerge.all(
      payload.map((item) => item.devDependencies ?? []),
    ),
    files: deduplicatedFiles,
  });

  return parsed;
}

async function resolveDependenciesRecursively(
  dependencies: string[],
  options: {
    useCache?: boolean;
  } = {},
  visited: Set<string> = new Set(),
) {
  const items: z.infer<typeof registryItemSchema>[] = [];

  for (const dep of dependencies) {
    if (visited.has(dep)) {
      continue;
    }
    visited.add(dep);

    try {
      const [item] = await fetchRegistryItems([dep], options);
      if (item && item.registryDependencies) {
        const resolvedDeps = item.registryDependencies;
        const nested = await resolveDependenciesRecursively(
          resolvedDeps,
          options,
          visited,
        );
        items.push(...nested.items, item);
      } else if (item) {
        items.push(item);
      }
    } catch (error) {
      throw error;
    }
  }

  return {
    items,
  };
}

function computeItemHash(
  item: Pick<z.infer<typeof registryItemSchema>, 'name'>,
  source?: string,
) {
  const identifier = source || item.name;

  const hash = createHash('sha256')
    .update(identifier)
    .digest('hex')
    .substring(0, 8);

  return `${item.name}::${hash}`;
}

function extractItemIdentifierFromDependency(dependency: string) {
  return {
    name: dependency,
    hash: computeItemHash({ name: dependency }, dependency),
  };
}

function topologicalSortRegistryItems(
  items: z.infer<typeof registryItemWithSourceSchema>[],
  sourceMap: Map<z.infer<typeof registryItemWithSourceSchema>, string>,
) {
  const itemMap = new Map<
    string,
    z.infer<typeof registryItemWithSourceSchema>
  >();
  const hashToItem = new Map<
    string,
    z.infer<typeof registryItemWithSourceSchema>
  >();
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  items.forEach((item) => {
    const source = sourceMap.get(item) || item.name;
    const hash = computeItemHash(item, source);

    itemMap.set(hash, item);
    hashToItem.set(hash, item);
    inDegree.set(hash, 0);
    adjacencyList.set(hash, []);
  });

  // Build a map of dependency to possible items.
  const depToHashes = new Map<string, string[]>();
  items.forEach((item) => {
    const source = sourceMap.get(item) || item.name;
    const hash = computeItemHash(item, source);

    if (!depToHashes.has(item.name)) {
      depToHashes.set(item.name, []);
    }
    depToHashes.get(item.name)!.push(hash);

    if (source !== item.name) {
      if (!depToHashes.has(source)) {
        depToHashes.set(source, []);
      }
      depToHashes.get(source)!.push(hash);
    }
  });

  items.forEach((item) => {
    const itemSource = sourceMap.get(item) || item.name;
    const itemHash = computeItemHash(item, itemSource);

    if (item.registryDependencies) {
      item.registryDependencies.forEach((dep) => {
        let depHash: string | undefined;

        const exactMatches = depToHashes.get(dep) || [];
        if (exactMatches.length === 1) {
          depHash = exactMatches[0];
        } else if (exactMatches.length > 1) {
          // Multiple matches - try to disambiguate.
          // For now, just use the first one and warn.
          depHash = exactMatches[0];
        } else {
          const { name } = extractItemIdentifierFromDependency(dep);
          const nameMatches = depToHashes.get(name) || [];
          if (nameMatches.length > 0) {
            depHash = nameMatches[0];
          }
        }

        if (depHash && itemMap.has(depHash)) {
          adjacencyList.get(depHash)!.push(itemHash);
          inDegree.set(itemHash, inDegree.get(itemHash)! + 1);
        }
      });
    }
  });

  // Implements Kahn's algorithm.
  const queue: string[] = [];
  const sorted: z.infer<typeof registryItemWithSourceSchema>[] = [];

  inDegree.forEach((degree, hash) => {
    if (degree === 0) {
      queue.push(hash);
    }
  });

  while (queue.length > 0) {
    const currentHash = queue.shift()!;
    const item = itemMap.get(currentHash)!;
    sorted.push(item);

    adjacencyList.get(currentHash)!.forEach((dependentHash) => {
      const newDegree = inDegree.get(dependentHash)! - 1;
      inDegree.set(dependentHash, newDegree);

      if (newDegree === 0) {
        queue.push(dependentHash);
      }
    });
  }

  if (sorted.length !== items.length) {
    console.warn('Circular dependency detected in registry items');
    // Return all items even if there are circular dependencies
    // Items not in sorted are part of circular dependencies
    const sortedHashes = new Set(
      sorted.map((item) => {
        const source = sourceMap.get(item) || item.name;
        return computeItemHash(item, source);
      }),
    );

    items.forEach((item) => {
      const source = sourceMap.get(item) || item.name;
      const hash = computeItemHash(item, source);
      if (!sortedHashes.has(hash)) {
        sorted.push(item);
      }
    });
  }

  return sorted;
}
