// See the shakacode/shakapacker README and docs directory for advice on customizing your webpackConfig.
const path = require('path');
const { generateWebpackConfig, inliningCss, merge } = require('shakapacker');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

const webpackConfig = generateWebpackConfig();

if (isDevelopment && inliningCss) {
  webpackConfig.plugins.push(
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockPort: webpackConfig.devServer.port,
      },
    })
  );
}

module.exports = merge(webpackConfig, {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../..', 'app/javascript'),
    },
  },
});
