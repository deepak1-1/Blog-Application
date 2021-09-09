
const jwt = require('jsonwebtoken');
const userDataModel = require('../models/userDataModel.ejs');

function returnProfilePath(data){
	let profilePath = data.profilePath+data.profilePicName;
    if(profilePath === "" || !profilePath){
        if(data.gender === 'male'){
            profilePath = '/Photos/male.jpg';
        }else {
            profilePath = '/Photos/female.jpg';
        }
    } else {
        profilePath = profilePath.replace('./public', '');
    }
	return profilePath;
}

// *****************main routes functions *************

const get_profile = async (req, res)=>{

	userDataModel.findOne( {username: req.data.username}, (err, data)=>{

		let profilePath = returnProfilePath(data)
		
		let followers = data.followers.length, 
			following = data.following.length,
			gender = data.gender,
			totalposts = data.posts.length + data.privatePosts.length,
			name = data.name;

		let interestedTag = data.tagsInterested;

		if(interestedTag.length === 0)
			interestedTag = false;
		
		let	accountCreated = String(data.createdAt);
		let array = accountCreated.split(" ");
		accountCreated = `${array[2]} ${array[1]} ${array[3]}`;
		let sendData = {
			profile: true,
			profilePath,
			name,
			followers,
			following,
			gender,
			totalposts,
			interestedTag,
			accountCreated
		}
		res.render('homepage/profile', { title: 'Profile', stylesheet: '/css/index.css', sendData});
	})
}

const get_create_blog = (req, res)=>{

	userDataModel.findOne( {username: req.data.username}, (err, data)=>{
		if(err){
			console.log("Error inside homepage controller get_create_blog: "+err)
		} else {

			let sendData = {
				createBlog: true,
				name: data.name,
				profilePath: returnProfilePath(data)
			}
			res.render('homepage/createBlog', { title: 'Create Blog', stylesheet: '/css/index.css', sendData})
		}
	} )
	
}

module.exports = {
	get_profile,
	get_create_blog
}