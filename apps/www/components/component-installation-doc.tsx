import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import Link from 'next/link';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RegistryItem } from '@/types/registry';
import { PackageRunner } from '@/components/package-runner';
import { Step, Steps } from '@/components/steps';
import { PackageInstaller } from '@/components/package-installer';
import registry from '@/public/r/registry.json';

export async function ComponentInstallationDoc({ name }: { name: string }) {
  return (
    <Tabs defaultValue="cli">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>

      <TabsContent value="cli">
        <PackageRunner command={`saaj add ${name}`} />
      </TabsContent>

      <TabsContent value="manual">
        <ComponentManualInstallationDoc name={name} />
      </TabsContent>
    </Tabs>
  );
}

export async function ComponentManualInstallationDoc({
  name,
}: {
  name: string;
}) {
  const component = (await import(`@/public/r/${name}.json`)) as RegistryItem;

  if (!component) {
    return (
      <div>
        <p>Component not found in registry</p>
      </div>
    );
  }

  const dependencies = component?.dependencies || [];
  const registryDependencies = component?.registryDependencies || [];

  const files = component.files;

  return (
    <Steps>
      {dependencies.length > 0 && (
        <Step>
          <p>Install the following dependencies:</p>
          <PackageInstaller dependencies={dependencies} />
        </Step>
      )}
      {registryDependencies.length > 0 && (
        <Step>
          <p>Add the following registry dependencies:</p>
          <ul>
            {registryDependencies.map((dep) => (
              <li key={dep}>
                <Link
                  href={getRegistryItemDocsLink(dep)}
                  className="capitalize no-underline hover:underline"
                >
                  {dep}
                </Link>
              </li>
            ))}
          </ul>
        </Step>
      )}
      {files.length > 0 && (
        <Step>
          <p>Copy and paste the following code into your project.</p>
          {files.map((file) => (
            <div
              key={file.path}
              className="[&>figure]:my-0 [&>figure]:rounded-none [&>figure]:border-none mb-0"
            >
              <div className="flex items-center text-sm font-mono text-fd-muted-foreground bg-fd-secondary px-4 py-2 rounded-t-xl border-b border-fd-border/60">
                {'components/ui/' +
                  file.path.slice(file.path.lastIndexOf('/') + 1)}
              </div>
              <DynamicCodeBlock lang="tsx" code={file.content || ''} />
            </div>
          ))}
        </Step>
      )}
    </Steps>
  );
}

function getRegistryItemDocsLink(name: string) {
  const item = registry.items.find((item) => item.name === name);
  if (!item) {
    return `/docs/components/${name}`;
  }
  if (item.type === 'registry:ui') {
    return `/docs/components/${name}`;
  }
  if (item.type === 'registry:hook') {
    return `/docs/hooks/${name}`;
  }
  if (item.type === 'registry:util') {
    return `/docs/utils/${name}`;
  }
  return `/docs/components/${name}`;
}
