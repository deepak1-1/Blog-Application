
const express = require('express');
const router = express.Router();
const basicController = require('../controllers/basicController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth.checkLoginAccess, basicController.get_login_page); // login singup page (req, res)

router.get('/about', auth.checkLoginAccess, basicController.get_about); // about

router.get('/home-page', auth.checkLoginAccess, basicController.get_home_page)

router.post('/log-out', auth.checkLoginAccess, basicController.log_out);

router.post('/follow', auth.checkLoginAccess, basicController.follow);

router.post('/unfollow', auth.checkLoginAccess, basicController.unfollow);

router.post('/cancel-request', auth.checkLoginAccess, basicController.cancel_request);

router.post('/accept-request', auth.checkLoginAccess, basicController.accept_request);

router.post('/reject-request', auth.checkLoginAccess, basicController.reject_request);

module.exports = router;