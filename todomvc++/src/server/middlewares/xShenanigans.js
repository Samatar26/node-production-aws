const xShenanigans = () => (req, res, next) => {
  res.set('X-Shenanigans', 'None')
  next()
}

module.exports = xShenanigans