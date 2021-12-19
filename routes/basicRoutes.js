
const express = require('express');
const router = express.Router();
const basicController = require('../controllers/basicController');

router.get('/',  basicController.get_login_page); // login singup page (req, res)

router.get('/about',  basicController.get_about); // about

router.get('/home-page',  basicController.get_home_page)

router.post('/log-out',  basicController.log_out);

router.post('/follow',  basicController.follow);

router.post('/unfollow',  basicController.unfollow);

router.post('/cancel-request',  basicController.cancel_request);

router.post('/accept-request',  basicController.accept_request);

router.post('/reject-request',  basicController.reject_request);

router.post('/remove',  basicController.remove_follower);

router.post('/like',  basicController.like)

router.post('/dislike',  basicController.dislike)

router.post('/:username',  basicController.show_user)

module.exports = router;