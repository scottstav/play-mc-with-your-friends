const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new CopyPlugin([
      { from: 'favicon', to: 'favicon' },
      { from: 'dotfiles.sh', to: 'dotfiles.sh' },
      { from: 'keybase.txt', to: 'keybase.txt' }
    ]),
    new webpack.EnvironmentPlugin({
      // development is default
      NODE_ENV: 'development',
      API_URL: 'https://api.scotty.dance'
    })
  ],
};
