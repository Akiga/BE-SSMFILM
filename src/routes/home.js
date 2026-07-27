const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const authApi = require('../middlewares/authApi')

router.get('/', homeController.firstPage);

router.get('/home', homeController.home);

router.get("/categories", homeController.getCategories);

router.get("/countries", homeController.getCountries);

router.get('/list', homeController.list);

router.get('/search', homeController.search);

router.get('/list/:slug', homeController.topic);

router.get('/category/:slug', homeController.category);

router.get('/country/:slug', homeController.country);

router.get('/movie/:slug', homeController.detail)

router.get('/watch/:slug', homeController.watchFilm);

router.post('/register', homeController.register);

router.post('/login', homeController.login);

router.post("/history", authApi, homeController.addHistory);

router.get("/history", authApi, homeController.getHistory);

router.delete("/history/:slug", authApi, homeController.removeHistory);



module.exports = router