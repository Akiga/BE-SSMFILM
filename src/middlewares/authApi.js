const jwt = require("jsonwebtoken");
const User = require("../models/users");

require("dotenv").config();

const authApi = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập",
            });
        }

        // Lấy JWT thật sự
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại",
            });
        }

        req.user = user;

        next();
    } catch (err) {
        console.error(err);

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
        });
    }
};

module.exports = authApi;