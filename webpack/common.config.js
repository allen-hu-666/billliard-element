const path = require('path');

module.exports = {
  entry: {
    'billiard-element': './src/billiard-element.js',
    'demo-without-framework': './src/demo-without-framework.js',
  },
  output: {
    libraryTarget: 'this',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].min.js'
  },
  module: {
    rules: [{
        test: /\.scss$/,
        loader: 'css-loader!sass-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      //'vue$': 'vue/dist/vue.esm.js'
    }
  },
  performance: {
    hints: false
  }
}