
const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');

router.get('/profile', homepageController.get_profile); 

router.get('/create-blog', homepageController.get_create_blog);

module.exports = router;