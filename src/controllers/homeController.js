const { getPhimList, getPhimDetail, getChuDe, getFilmCategory, getCountryCategory, search, getCategory, getCountry} = require('../services/phimService');
const userModel = require('../models/users');
const filmModel = require('../models/filmed');
const favoriteModel = require('../models/favorite');
const guestModel = require('../models/filmForGuest');
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

    // async register(req, res) {
    //     try {
    //         const userData = req.body;
    //         // Hash the password before saving
    //         userData.password = await bcrypt.hash(userData.password, 10);
    //         const user = new userModel(userData);
    //         await user.save();
    //         req.session.successMessage = 'Đăng ký thành công!';
    //         req.session.openModal = true;
    //         res.redirect('/');
    //     } catch (error) {
    //         if (error.code === 11000) {
    //             req.session.errorMessage = 'Email đã được sử dụng, vui lòng thử lại!';
    //             req.session.openModalRegister = true;
    //             res.redirect('/');
    //         }
    //     }
    // }

    // async login(req, res) {
    //     try {
    //         const userLogin = req.body;

    //         const user = await userModel.findOne({ 
    //             email: userLogin.email
    //         });
    //         if(user && await bcrypt.compare(userLogin.password, user.password)) {
    //             const token = jwt.sign({
    //                 id: user._id
    //             }, process.env.JWT_SECRET, { expiresIn: '1d' });
    //             return res.json({ token })
    //         } else {
    //             return res.status(200).json({ error: 'Email hoặc mật khẩu không đúng' });
    //         }
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         return res.status(500).render('pages/error', { error: 'Lỗi khi đăng nhập' });
    //     }
    // }

    // async logout(req, res) {
    //     try {
    //         res.clearCookie('token');
    //         res.redirect('/');
    //     } catch (error) {
    //         console.error('Logout error:', error);
    //         res.status(500).render('pages/error', { error: 'Lỗi khi đăng xuất' });
    //     }
    // }

}

module.exports = new homeController;