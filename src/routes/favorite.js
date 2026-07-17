const express = require("express");
const router = express.Router();

const favoriteController = require("../controllers/favoriteController");
const authApi = require("../middlewares/authApi");

router.get("/", authApi, favoriteController.getFavorites);

router.get(
    "/check/:slug",
    authApi,
    favoriteController.checkFavorite
);

router.post(
    "/",
    authApi,
    favoriteController.addFavorite
);

router.delete(
    "/:slug",
    authApi,
    favoriteController.removeFavorite
);

module.exports = router;