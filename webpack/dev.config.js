const commonConfig = require('./common.config.js');

commonConfig.devtool = "#eval-source-map";

commonConfig.devServer = {
  historyApiFallback: true,
  noInfo: true
};

module.exports = commonConfig