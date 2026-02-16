import _traverse from '@babel/traverse';

// We need to use traverse.default instead of traverse (that's how Node.js' interop between ESM and CJS works).
const traverse = (_traverse as any).default as typeof _traverse;

export { traverse };
