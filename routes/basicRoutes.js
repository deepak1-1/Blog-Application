
const express = require('express');
const router = express.Router();
const basicController = require('../controllers/basicController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth.checkLoginAccess, basicController.get_login_page); // login singup page (req, res)

router.get('/about', auth.checkLoginAccess, basicController.get_about); // about

router.get('/home-page', auth.checkLoginAccess, basicController.get_home_page)

module.exports = router;