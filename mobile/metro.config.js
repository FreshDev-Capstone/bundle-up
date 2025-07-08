const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ensure single React instance to prevent hook errors
config.resolver.alias = {
  ...config.resolver.alias,
  "react": path.resolve(__dirname, "node_modules/react"),
  "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
};

module.exports = config;
