const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'block-paint.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'BlockPaint'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  }
};
