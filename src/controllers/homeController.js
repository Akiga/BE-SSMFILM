const { getPhimList, getPhimDetail, getChuDe, getFilmCategory, getCountryCategory, search, getCategory, getCountry} = require('../services/phimService');
const userModel = require('../models/users');
const historyModel = require("../models/history");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
class homeController{
    
    async getCategories(req, res) {
        try {
            const data = await getCategory();

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
}

    async getCountries(req, res) {
        try {
            const data = await getCountry();

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
}

    async firstPage (req, res){
        res.json({
            message: 'Chào mừng bạn đến với trang xem phim'
        })
    }

    // Trang chủ
    async home(req, res) {
    try {
        const movies = await getPhimList();
        const phimLe = await getChuDe('phim-le', 1, 10);
        const phimBo = await getChuDe('phim-bo', 1, 10);
        const hoatHinh = await getChuDe('hoat-hinh', 1, 10);
        const tvShows = await getChuDe('tv-shows', 1, 10);

        res.status(200).json({
            success: true,
            data: {
                movies,
                phimLe,
                phimBo,
                hoatHinh,
                tvShows
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
    // Trang danh sách phim
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const movies = await getPhimList(page);
            res.json({
                success: true,
                data: {
                    movies,
                    currentPage: page,
                    totalPage: movies.pagination.totalPages
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
}
    // Chức năng tìm kiếm
    async search(req, res) {
        try{
            const q = req.query.keyword || '';
            const page = parseInt(req.query.page) || 1;
            const movies = await search(q, page);
            res.json({
                success: true,
                data: {
                    movies,
                    currentPage: page,
                    totalPage: movies.data.params.pagination.totalItemsPerPage,
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Chủ đề phim như: phim lẻ, phim bộ,...
    async topic(req, res) {
        const page = parseInt(req.query.page) || 1;
        const slug = req.params.slug;
        const movies = await getChuDe(slug, page, 50);
        res.json({
            success: true,
            data: {
                movies,
                currentPage: page,
                totalPage: movies.data.params.pagination,
                country: '',
                categori: '',
                chuDe: slug
            }
        })
    }

    // Thể loại phim như: hành động,...
    async category(req, res) {
        const page = parseInt(req.query.page) || 1;
        const slug = req.params.slug;
        const movies = await getFilmCategory(slug, page);
        res.json({
            success: true,
            data: {
                movies,
                currentPage: page,
                totalPage: movies.data.params.pagination,
                country: '',
                categori: slug,
                chuDe: ''
            }
        })
    }

    // Lựa chọn phim theo Quốc Gia
    async country(req, res) {
        const slug = req.params.slug;
        const page = parseInt(req.query.page) || 1;
        const movies = await getCountryCategory(slug, page);
        res.json({
            success: true,
            data: {
                movies,
                currentPage: page,
                totalPage: movies.data.params.pagination,
                country : slug,
                categori: '',
                chuDe: ''
            }
        });
    }

    // Trang chi tiết phim
    async detail(req, res){
        // const watchedFilm = await favoriteModel.findOne({ userId: userID, slug: req.params.slug });
        const slug = req.params.slug
        const detailFilm = await getPhimDetail(slug)
        res.json({
            success: true,
            data: {
                detailFilm,
                // watchedFilm
            }
        });
    }

    async watchFilm(req, res) {
    try {

        const slug = req.params.slug;

        const episode = req.query.ep;

        const detailFilm = await getPhimDetail(slug);

        res.json({
            success: true,
            data: detailFilm,
            currentEpisode: episode || null
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
}

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const existedUser = await userModel.findOne({ email });

            if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "Email đã được sử dụng.",
            });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const user = await userModel.create({
            username,
            email,
            password: hashPassword,
            });

            res.status(201).json({
            success: true,
            message: "Đăng ký thành công.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi máy chủ.",
            });
        }
        }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Kiểm tra dữ liệu
            if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập email và mật khẩu.",
            });
            }

            // Tìm user
            const user = await userModel.findOne({ email });

            if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email hoặc mật khẩu không đúng.",
            });
            }

            // So sánh mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu không đúng.",
            });
            }

            // Tạo JWT
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d",
                }
            );

            return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ.",
            });
        }
    }

    async addHistory(req, res) {
        try {
            const { slug, name, poster, episode } = req.body;
            const userId = req.user.id;

            const existed = await historyModel.findOne({
                userId,
                slug,
            });

            if (existed) {
                existed.episode = episode;
                existed.watchedAt = new Date();

                await existed.save();

                return res.json({
                    success: true,
                    message: "Đã cập nhật lịch sử",
                });
            }

            await historyModel.create({
                userId,
                slug,
                name,
                poster,
                episode,
            });

            res.json({
                success: true,
                message: "Đã thêm lịch sử",
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async getHistory(req, res) {
        try {
            const userId = req.user.id;

            const histories = await historyModel
                .find({ userId })
                .sort({ watchedAt: -1 });

            res.json({
                success: true,
                histories,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async removeHistory(req, res) {
        try {
            const userId = req.user.id;
            const { slug } = req.params;

            await historyModel.deleteOne({
                userId,
                slug,
            });

            res.json({
                success: true,
                message: "Đã xóa",
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}
    

module.exports = new homeController;