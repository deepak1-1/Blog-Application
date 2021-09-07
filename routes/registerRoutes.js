
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');

// some userfull functions

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		fs.mkdir('./Data/User Image/deepak', (err)=>{
			if(!err){
				cb(null, './Data/User Image/deepak/');		
			}
		})
	},
	filename: function(req, file, cb){
		cb(null, file.originalname)
	}
})

const upload = multer({
	storage: storage
})



// main routes

router.get( '/', auth.checkRegisterAccess, registerController.userForm );

router.post('/', auth.checkRegisterAccess, registerController.InsertUser);

router.get('/profile-photo', auth.checkRegisterAccess, registerController.userImageInput);

router.post('/profile-photo', auth.checkRegisterAccess, upload.single('profile'), registerController.saveUserImage);

module.exports = router;
