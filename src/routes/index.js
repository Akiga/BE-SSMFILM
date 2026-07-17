const homeRouter = require('./home')
const favoriteRouter = require('./favorite')
function route(app) {
  app.use('/', homeRouter);
  app.use('/favorites', favoriteRouter)
}

module.exports = route;