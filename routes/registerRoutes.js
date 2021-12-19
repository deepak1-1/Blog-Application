
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const loginDataModel = require('../models/signModel.ejs');
const InsertUserDataModel = require('../models/userDataModel.ejs');


// some userfull functions

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		loginDataModel.find( {username: req.data.username}, (err, data)=>{
			
			if(data.length === 1){

				let folderName = data[0].id;
				fs.mkdir(`./public/Data/User Image/${folderName}`, (err)=>{
					if(!err){
						cb(null, `./public/Data/User Image/${folderName}/`);		
					} else {
						cb(null, `./public/Data/User Image/${folderName}/`);
					}
				})	
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

// router.get( '/', auth.checkRegisterAccess, registerController.userForm );
router.get( '/', registerController.userForm );


// router.post('/', auth.checkRegisterAccess, registerController.InsertUser);
router.post('/', registerController.InsertUser);


// router.get('/profile-photo', auth.checkProfileUpload, registerController.userImageInput);
router.get('/profile-photo', registerController.userImageInput);

// router.post('/profile-photo', auth.checkProfileUpload, upload.single('profile'), registerController.saveUserImage);
router.post('/profile-photo', upload.single('profile'), registerController.saveUserImage);

// router.post('/profile-photo/skip', auth.checkProfileUpload, registerController.skipUserImage);
router.post('/profile-photo/skip', registerController.skipUserImage);

module.exports = router;
