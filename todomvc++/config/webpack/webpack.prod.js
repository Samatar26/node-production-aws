const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  devtool: 'source-map',
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
  plugins: [
    new ExtractTextWebpackPlugin('app.min.css'),
    new UglifyJsWebpackPlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
  ],
}
