
const mailer = require('nodemailer');
const loginDataModel = require('../models/signModel.ejs');
const InsertUserDataModel = require('../models/userDataModel.ejs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
			res.send( {successfull: true, redirect:''} )
		})
		.catch( err=>{
			console.log(err);
			res.send( {successfull: false} )
		});
}




module.exports = {
	InsertUser
}

