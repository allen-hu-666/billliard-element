const commonConfig = require('./prod-web.config.js');

commonConfig.output.libraryTarget='commonjs2';
commonConfig.output.filename='[name].export.min.js';

module.exports = commonConfig;