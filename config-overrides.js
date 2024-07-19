const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  (config) => {
    config.entry = path.resolve(__dirname, 'index.js');
    return config;
  }
);
