export interface RegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:component' | 'registry:hook' | 'registry:util' | 'registry:block' | 'registry:file';
  description?: string;
  title?: string;
  author?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: {
    path: string;
    content?: string;
    type: 'registry:util' | 'registry:block' | 'registry:component' | 'registry:ui' | 'registry:hook' | 'registry:theme' | 'registry:page' | 'registry:file' | 'registry:style' | 'registry:base' | 'registry:item';
    target?: string;
  }[];
  meta?: Record<string, any>;
  docs?: string;
}
