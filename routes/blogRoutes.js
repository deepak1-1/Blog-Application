
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.get_create_blog);
// router.get('/about', blogController.get_about); 

module.exports = router;