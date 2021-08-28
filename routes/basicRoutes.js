
const express = require('express');
const router = express.Router();
const basicController = require('../controllers/basicController');

router.get('/', basicController.get_login_page); // login singup page (req, res)

router.get('/about', basicController.get_about); // about

router.get('/home-page', basicController.get_home_page)

module.exports = router;