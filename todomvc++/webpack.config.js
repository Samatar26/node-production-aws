const webpack = require('webpack')
const path = require('path')
const webpackMerge = require('webpack-merge')

module.exports = (env = process.env.NODE_ENV) => {
  const baseConfig = {
    entry: {
      app: ['./src/browser/js/app.js', './src/browser/scss/app.scss'],
    },
    output: {
      filename: `[name].${env === 'prod' ? 'min.' : ''}js`,
      path: path.resolve(__dirname, './public'),
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
    ],
    devServer: {
      publicPath: '/public/',
      port: 9000,
    },
  }

  const envConfig = require(`./config/webpack/webpack.${env}.js`)
  const mergedConfig = webpackMerge(baseConfig, envConfig)

  return mergedConfig
}
