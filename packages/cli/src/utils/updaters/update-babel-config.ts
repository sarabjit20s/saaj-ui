import fs from 'fs-extra';
import path from 'path';
import * as parser from '@babel/parser';
import { generate } from '@babel/generator';
import * as t from '@babel/types';
import { execa } from 'execa';

import { traverse } from '@/src/utils/traverse';
import { ProjectInfo } from '@/src/utils/get-project-info';
import { Config } from '@/src/utils/get-config';
import { FRAMEWORKS } from '@/src/utils/frameworks';
import { logger } from '@/src/utils/logger';
import { getPackageInfo } from '@/src/utils/get-package-info';

const MODULE_RESOLVER_PLUGIN = 'module-resolver';
const UNISTYLES_PLUGIN = 'react-native-unistyles/plugin';
const REACT_NATIVE_WORKLETS_PLUGIN = 'react-native-worklets/plugin';

let changed = false;

export async function addPluginsToBabelConfig(
  projectInfo: ProjectInfo,
  config: Config,
) {
  const babelConfigFilePath = path.join(
    config.resolvedPaths.cwd,
    'babel.config.js',
  );

  // If framework is Expo, create a new babel config file if it doesn't exist
  const babelConfigExists = await fs.exists(babelConfigFilePath);
  if (projectInfo.framework.name === 'expo' && !babelConfigExists) {
    // Create new babel config file using expo customize command
    await execa`npx expo customize babel.config.js`;
  }

  const babelConfigCode = await fs.readFile(babelConfigFilePath, 'utf-8');

  const ast = parser.parse(babelConfigCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy'],
  });

  let shouldPrintInstructions = false;

  traverse(ast, {
    AssignmentExpression(path) {
      // Detect module.exports = <obj> or module.exports = function(api) { return {...} }
      const left = path.node.left;

      if (
        t.isMemberExpression(left) &&
        t.isIdentifier(left.object, {
          name: 'module',
        }) &&
        t.isIdentifier(left.property, {
          name: 'exports',
        })
      ) {
        const right = path.node.right;

        if (t.isObjectExpression(right)) {
          // module.exports = { ... }
          handlePluginsObjectExpression(right, projectInfo, config);
        } else if (
          t.isFunctionExpression(right) ||
          t.isArrowFunctionExpression(right)
        ) {
          // module.exports = function(api) { ... }
          // Find return statement inside function
          path.get('right').traverse({
            ReturnStatement(returnPath) {
              const arg = returnPath.node.argument;
              if (t.isObjectExpression(arg)) {
                handlePluginsObjectExpression(arg, projectInfo, config);
              } else {
                shouldPrintInstructions = true;
              }
            },
          });
        }
      }
    },

    ExportDefaultDeclaration(path) {
      // Detect export default <obj>
      const decl = path.node.declaration;
      if (t.isObjectExpression(decl)) {
        handlePluginsObjectExpression(decl, projectInfo, config);
      } else {
        // Handle function expression
        path.traverse({
          ReturnStatement(returnPath) {
            if (t.isObjectExpression(returnPath.node.argument)) {
              handlePluginsObjectExpression(
                returnPath.node.argument,
                projectInfo,
                config,
              );
            } else {
              shouldPrintInstructions = true;
            }
          },
        });
      }
    },
  });

  if (!changed) {
    if (shouldPrintInstructions) {
      logger.break();
      logger.warn('Could not find suitable place to automatically add plugin.');
      logger.break();
      logger.info(
        `Please follow the manual installation instructions: ${FRAMEWORKS.manual.links.installation}`,
      );
    }
    return;
  }

  const output = generate(
    ast,
    {
      retainLines: true,
    },
    babelConfigCode,
  ).code;

  await fs.writeFile(babelConfigFilePath, output, 'utf-8');
}

function handlePluginsObjectExpression(
  objExpr: t.ObjectExpression,
  projectInfo: ProjectInfo,
  config: Config,
) {
  const packageInfo = getPackageInfo(config.resolvedPaths.cwd);

  let pluginsProp = findPluginsProp(objExpr);

  if (!pluginsProp) {
    // Add plugins: []
    pluginsProp = t.objectProperty(
      t.identifier('plugins'),
      t.arrayExpression([]),
    );
    objExpr.properties.push(pluginsProp);
    changed = true;
  }

  if (
    t.isObjectProperty(pluginsProp) &&
    t.isArrayExpression(pluginsProp.value)
  ) {
    const pluginsExpr = pluginsProp.value;

    // Add module-resolver plugin
    if (projectInfo.framework.name === 'react-native') {
      if (!pluginExistsInArray(pluginsExpr, MODULE_RESOLVER_PLUGIN)) {
        pluginsExpr.elements.push(
          t.arrayExpression([
            t.stringLiteral(MODULE_RESOLVER_PLUGIN),
            t.objectExpression([
              t.objectProperty(
                t.identifier('root'),
                t.stringLiteral(projectInfo.isSrcDir ? './src' : '.'),
              ),
              t.objectProperty(
                t.identifier('extensions'),
                t.arrayExpression([
                  t.stringLiteral('.ios.js'),
                  t.stringLiteral('.android.js'),
                  t.stringLiteral('.js'),
                  t.stringLiteral('.jsx'),
                  t.stringLiteral('.ts'),
                  t.stringLiteral('.tsx'),
                  t.stringLiteral('.json'),
                ]),
              ),
              t.objectProperty(
                t.identifier('alias'),
                t.objectExpression([
                  t.objectProperty(
                    t.identifier(
                      projectInfo.aliasPrefix
                        ? `'${projectInfo.aliasPrefix}'`
                        : '@',
                    ),
                    t.stringLiteral(projectInfo.isSrcDir ? './src' : '.'),
                  ),
                ]),
              ),
            ]),
          ]),
        );
        changed = true;
      }
    }

    // Add unistyles plugin
    if (!pluginExistsInArray(pluginsExpr, UNISTYLES_PLUGIN)) {
      if (projectInfo.isSrcDir) {
        // add unistyles plugin with root folder
        pluginsExpr.elements.push(
          t.arrayExpression([
            t.stringLiteral(UNISTYLES_PLUGIN),
            t.objectExpression([
              t.objectProperty(t.identifier('root'), t.stringLiteral('src')),
            ]),
          ]),
        );
      } else {
        const isExpoRouterProject =
          !!packageInfo?.dependencies?.['expo-router'];

        if (projectInfo.framework.name === 'expo' && isExpoRouterProject) {
          pluginsExpr.elements.push(
            t.arrayExpression([
              t.stringLiteral(UNISTYLES_PLUGIN),
              t.objectExpression([
                t.objectProperty(t.identifier('root'), t.stringLiteral('app')),
              ]),
            ]),
          );
        } else {
          pluginsExpr.elements.push(
            t.arrayExpression([
              t.stringLiteral(UNISTYLES_PLUGIN),
              t.objectExpression([
                t.objectProperty(
                  t.identifier('root'),
                  t.stringLiteral('components'),
                ),
              ]),
            ]),
          );
        }
      }
      changed = true;
    }

    // In the last, add react-native-worklets plugin
    if (projectInfo.framework.name === 'react-native') {
      if (!pluginExistsInArray(pluginsExpr, REACT_NATIVE_WORKLETS_PLUGIN)) {
        pluginsExpr.elements.push(
          t.stringLiteral(REACT_NATIVE_WORKLETS_PLUGIN),
        );
        changed = true;
      }
    }
  }
}

function findPluginsProp(objExpr: t.ObjectExpression) {
  return objExpr.properties.find(
    (p) =>
      t.isObjectProperty(p) &&
      ((t.isIdentifier(p.key) && p.key.name === 'plugins') ||
        (t.isStringLiteral(p.key) && p.key.value === 'plugins')),
  );
}

function pluginExistsInArray(arrExpr: t.ArrayExpression, pluginName: string) {
  return (arrExpr.elements || []).some((el) => {
    if (!el) return false;
    // Plugin can be 'name' or ['name', {opts}]
    if (t.isStringLiteral(el)) return el.value === pluginName;
    if (t.isArrayExpression(el) && t.isStringLiteral(el.elements[0])) {
      return el.elements[0].value === pluginName;
    }
    return false;
  });
}
