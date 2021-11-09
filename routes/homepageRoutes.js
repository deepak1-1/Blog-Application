
const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');

router.get('/profile', homepageController.get_profile); 

router.get('/followers', homepageController.get_followers);

router.get('/following', homepageController.get_following);

router.get('/posts', homepageController.get_posts);

router.get('/private-post', homepageController.get_private_posts);

router.get('/create-blog', homepageController.get_create_blog);

router.get('/request', homepageController.get_request_page);

router.get('/notification', homepageController.get_notification_page);

router.post('/delete-post', homepageController.delete_post);

module.exports = router;