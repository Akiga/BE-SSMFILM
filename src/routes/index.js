const homeRouter = require('./home')
const favoriteRouter = require('./favorite')
const profileRouter = require('./profile')
function route(app) {
  app.use('/', homeRouter);
  app.use('/favorites', favoriteRouter)
  app.use('/profile', profileRouter)
}

module.exports = route;