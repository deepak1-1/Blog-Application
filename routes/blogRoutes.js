
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const InsertUserDataModel = require('../models/userDataModel.ejs');
const blogModel = require('../models/blogDataModel.ejs')
const path = require('path');

// some userfull functions

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, `./public/Data/Post Images/`);
	},
	filename: function(req, file, cb){
		cb(null, file.originalname.split('.')[0] + '-' + Date.now() + path.extname(file.originalname));
	}
})

const upload = multer({
	storage: storage
})


// main routes

router.post('/create-blog', upload.array('blogImages'), blogController.create_blog);

module.exports = router;
