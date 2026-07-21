const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const authApi = require('../middlewares/authApi')

router.get("/", authApi, profileController.getProfile);

router.put("/", authApi, profileController.updateProfile);

module.exports = router