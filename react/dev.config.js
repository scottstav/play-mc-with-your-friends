var HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'development', // dev
  devtool: 'cheap-module-eval-source-map', // dev
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
});
