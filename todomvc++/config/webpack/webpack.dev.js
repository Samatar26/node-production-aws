const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.scss/,
        use: ExtractTextWebpackPlugin.extract({
          use: 'css-loader',
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [new ExtractTextWebpackPlugin('app.css')],
}
