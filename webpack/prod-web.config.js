const commonConfig = require('./common.config.js')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');

commonConfig.devtool = '#source-map';
// http://vue-loader.vuejs.org/en/workflow/production.html
commonConfig.plugins = (commonConfig.plugins || []).concat([
  /* new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' }
  ]), */
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  })
]);

module.exports = commonConfig;