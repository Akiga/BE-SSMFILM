const Favorite = require("../models/favorites");

exports.addFavorite = async (req, res) => {
    try {
        const { slug } = req.body;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Thiếu slug phim",
            });
        }

        // Kiểm tra đã tồn tại chưa
        const existed = await Favorite.findOne({
            user: req.user._id,
            slug,
        });

        if (existed) {
            return res.status(400).json({
                success: false,
                message: "Phim đã có trong danh sách yêu thích",
            });
        }

        const favorite = await Favorite.create({
            user: req.user._id,
            slug,
        });

        return res.status(201).json({
            success: true,
            message: "Đã thêm vào yêu thích",
            data: favorite,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};


exports.removeFavorite = async (req, res) => {
    try {
        const { slug } = req.params;

        await Favorite.findOneAndDelete({
            user: req.user._id,
            slug,
        });

        return res.json({
            success: true,
            message: "Đã xóa khỏi yêu thích",
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const { slug } = req.params;

        const favorite = await Favorite.findOne({
            user: req.user._id,
            slug,
        });

        return res.json({
            success: true,
            isFavorite: !!favorite,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};


exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.json({
            success: true,
            data: favorites,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};