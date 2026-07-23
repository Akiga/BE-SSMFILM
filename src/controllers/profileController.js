const historyModel = require("../models/history");
const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class profileController {
    async getProfile(req, res){
        try {
            const user = await userModel
                .findById(req.user.id)
                .select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy người dùng",
                });
            }

            res.json({
                success: true,
                user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }

    async updateProfile (req, res){
        try {
            const { username } = req.body;

            if (!username || username.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Tên không được để trống",
                });
            }

            const user = await userModel.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy người dùng",
                });
            }

            user.username = username;

            await user.save();

            res.json({
                success: true,
                message: "Cập nhật thành công",
                user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }

    async changePassword (req, res){
        try {
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Vui lòng nhập đầy đủ thông tin.",
                });
            }

            const user = await userModel.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy người dùng.",
                });
            }

            const isMatch = await bcrypt.compare(
                oldPassword,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Mật khẩu hiện tại không đúng.",
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);

            await user.save();

            res.json({
                success: true,
                message: "Đổi mật khẩu thành công.",
            });

        } catch (error) {
            console.log(error);

            res.status(500).json({
                success: false,
                message: "Lỗi server.",
            });
        }
    }
}

module.exports = new profileController;