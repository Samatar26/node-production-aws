'use strict'

const { Router } = require('director/build/director')

module.exports = app => {
  let router = new Router()
  ;['all', 'active', 'completed'].forEach(function(visibility) {
    router.on(visibility, function() {
      app.visibility = visibility
    })
  })

  router.configure({
    notfound: function() {
      window.location.hash = ''
      app.visibility = 'all'
    },
  })
  console.log(router)
  router.init()
}
