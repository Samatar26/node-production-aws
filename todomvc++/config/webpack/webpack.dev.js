module.exports = {
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
