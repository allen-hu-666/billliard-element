const commonConfig = require('./prod-web.config.js');

commonConfig.output.libraryTarget='commonjs2';
commonConfig.output.filename='[name].export.min.js';
commonConfig.entry = {
    'billiard-element': './src/billiard-element.js'
};

module.exports = commonConfig;