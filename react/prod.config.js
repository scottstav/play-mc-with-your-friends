var HtmlWebpackPlugin = require('html-webpack-plugin');
var S3Uploader = require('webpack-s3-plugin');
var AWS = require('aws-sdk');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
  mode: 'production',

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new S3Uploader({
      s3Options: {
	credentials: new AWS.SharedIniFileCredentials({profile: 'default'}),
        region: 'us-east-1'
      },
      s3UploadOptions: {
        Bucket: 'scotty.dance'
      }
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'prod',
      API_URL: 'https://api.scotty.dance'
    })
  ]
});
