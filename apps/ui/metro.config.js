const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
  },
  watchFolders: [path.join(__dirname, '..', '..')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
