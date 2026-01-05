const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

// Wrap the default Expo config with NativeWind
const config = withNativeWind(defaultConfig, { input: './global.css' });

module.exports = config;
