var path = require('path')
var fs = require('fs-extra')

var publicPath = path.resolve(__dirname, '..', '..', 'public')
var staticPath = path.resolve(__dirname, '..', '..', 'src', 'browser', 'static')
fs.removeSync(publicPath)
fs.mkdirSync(publicPath)
fs.copySync(staticPath, publicPath)
