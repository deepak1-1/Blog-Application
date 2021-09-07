
const loginDataModel = require('../models/signModel.ejs');
const InsertUserDataModel = require('../models/userDataModel.ejs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// ************************ main routes functions ***************

const userForm = async (req, res)=>{

	loginDataModel.find( {username: req.data}, (err, data)=>{

	res.render('register/personalDetails', {title: 'Personal Details', 
							stylesheet: false,
							data: {
								email: data[0].email,
								username: data[0].username
							}
				});
	})
}

const InsertUser = async (req, res)=>{

	const dataInsert = InsertUserDataModel({
		username: req.body.username,
		name: req.body.name,
		gender: req.body.gender,
		followers: [],
		following: [],
		tagsInterested: req.body.interestedTag
	})
	dataInsert.save()
		.then(result =>{
			res.send( {successfull: true, redirect:'/register/profile-photo'} )
		})
		.catch( err=>{
			console.log(err);
			res.send( {successfull: false} )
		});
}


const userImageInput = (req, res)=>{

	res.render('register/userImage', {title: 'Profile Photo', stylesheet: false})
}

const saveUserImage = (req, res)=>{

	loginDataModel.find( {username: req.data}, (err, data)=>{
		console.log(data);
	})
	console.log(req.body);
	console.log(req.file);
}



module.exports = {
	userForm,
	InsertUser,
	userImageInput,
	saveUserImage
}

