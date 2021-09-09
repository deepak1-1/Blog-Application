
const loginDataModel = require('../models/signModel.ejs');
const InsertUserDataModel = require('../models/userDataModel.ejs');
const jwt = require('jsonwebtoken');


function createtoken( data, key, timeInMin ){

    return jwt.sign( {data}, key, {
        expiresIn: 60*timeInMin
    })
}


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
		profilePicName: "",
		profilePath: "",
		name: req.body.name,
		gender: req.body.gender,
		followers: [],
		following: [],
		posts: [],
		privatePosts: [],
		tagsInterested: req.body.interestedTag
	})
	dataInsert.save()
		.then(result =>{

            const token = createtoken( {username: req.body.username, name: req.body.name}, 'ValidUpload', 60 )//in mins
			res.cookie('jwtRegister', '', {maxAge: 1})
			res.cookie('jwtProfilePhoto', token,  { httpOnly: true, maxAge: 60*60*1000})
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

	InsertUserDataModel.updateOne(
			{'username': req.data.username}, //query
	        {$set: {profilePicName: req.file.filename, profilePath: req.file.destination}}, // update
	        {upsert: false},
	        (err, data)=>{

	        	if(err){
	        		console.log("Inside Image data: " + err);
	        	} else {

	        		userDataModel.findOne( {username: req.data.username}, (err, data)=>{
	        			if(err){
	        				console.log('Error Inside register Controller saveUserImage: '+err);
	        			} else{
	        				const token = createtoken( {username: req.data.username, name: data.name}, 'LoginAcess', 24*60 )//in mins
							res.cookie('jwtProfilePhoto', '', {maxAge: 1})
							res.cookie('jwtLoginAccess', token,  { httpOnly: true })
							res.redirect( '/Home-page' );
	        			}
	        		})
	        	}

	        }
		)
	
}

const skipUserImage = (req, res)=>{

	if(req.body.skip){
		userDataModel.findOne( {username: req.data.username}, (err, data)=>{
			if(err){
				console.log('Error Inside register Controller saveUserImage: '+err);
			} else{
				const token = createtoken( {username: req.data.username, name: data.name}, 'LoginAcess', 24*60 )//in mins
				res.cookie('jwtProfilePhoto', '', {maxAge: 1})
				res.cookie('jwtLoginAccess', token,  { httpOnly: true })
				res.redirect( '/Home-page' );
			}
		})
	}
}


module.exports = {
	userForm,
	InsertUser,
	userImageInput,
	saveUserImage,
	skipUserImage
}

