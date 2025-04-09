const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add src directory to asset extensions
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif');

// Add src directory to source directories
config.watchFolders = [__dirname, `${__dirname}/src`];

module.exports = config; 