
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const requestModel = require('../models/requestModel.ejs')

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

const get_followers = async (req, res)=>{

	let sendData;
	await userDataModel.findOne( { username: req.data.username }, (err, data)=>{
		
		if(err){
			console.log('Error inside homepage controller get_followers'+err);
		} else {

			if(data.followers.length !== 0){

				sendData = {
					name: data.name,
					profile: true,
					profilePath: returnProfilePath(data),
					followers: []
				}

				data.followers.forEach(eachFollower => {
					userDataModel.findOne( {username: eachFollower}, (err, followerData)=>{
						
						if(err){
							console.log('Error inside homepageController get_followers: '+err);
						} else {
							const appendData = {
								name: followerData.name,
								username: followerData.username,
								profilePath: returnProfilePath( followerData )
							}
							sendData.followers.push( appendData )
						}
					} )
				});

			} else {
				sendData = {
					name: data.name,
					profile: true,
					followers: false,
					profilePath: returnProfilePath(data)
				}
			}
		}
	})
	res.render('homepage/followers', { title: 'Followers', stylesheet: '/css/index.css', sendData});
}

const get_following = async (req, res) => {

	let sendData, loginData, userFollowing, userFollowers;
	await userDataModel.findOne( {username: req.data.username}, (err,data)=>{
		if(err){
			console.log('Error inside homepage controller get_following'+err)
		} else {
			
			userFollowing = data.following;
			userFollowers = data.followers;

			if(data.following.length !== 0){
				sendData = {
					name: data.name,
					profile: true,
					profilePath: returnProfilePath(data),
					following: [],
					suggestion: []
				}

				data.following.forEach(eachFollowing => {
					userDataModel.findOne( {username: eachFollowing}, (err, followingData)=>{
						
						if(err){
							console.log('Error inside homepageController get_following: '+err);
						} else {
							const appendData = {
								name: followingData.name,
								username: followingData.username,
								profilePath: returnProfilePath( followingData )
							}
							sendData.following.push( appendData )
						}
					} )
				});

			} else {
				sendData = {
					name: data.name,
					profile: true,
					following: false,
					profilePath: returnProfilePath(data),
					suggestion: []
				}
			}
		}
	})

	let loop = false;
	await loginDataModel.find( (err, data)=>{
		if(err){
			console.log('Error inside homepageController get_following: '+err)
		} else {

			loginData = data;
			if(data.length >=5){
				loop = 5;
			} else {
				loop = data.length;
			}
		}
	})

	if(loop){
		let i=0;
		while(i<loop){

			if(loginData[i].username !== req.data.username && loginData[i]){

				await userDataModel.findOne( {username: loginData[i].username}, (err, suggestionData)=>{
						if(err){
							console.log('Error inside homepageController get_following: '+err);
						} else {
							if(!suggestionData){
								if(loginData.length>loop){
									loop+=1
								}
							} else {
								
								const appendData = {
									username: suggestionData.username,
									name: suggestionData.name,
									profilePath: returnProfilePath(suggestionData)
								}
								sendData.suggestion.push(appendData);
							}
						}
					} )
			}
			i++;
		}
	}
	res.render('homepage/following', {title: 'Following', stylesheet: '/css/index.css', sendData})
}

const get_request_page = (req, res)=>{

	let requestData, sendData;

	await userDataModel.findOne( {username: req.data.username}, (err, data)=>{
		if(err){
			console.log(err);
		} else {
			console.log(data);
		}
	})

	await requestModel.find({receiver: req.data.username}, (err, data)=>{
		if(err){
			console.log('Error inside homepageController get_request_page: '+ err);
		} else {
			requestData = data;
		}
	})

	if(requestData.length !== 0){

		await userDataModel.findOne
	} else {

	}
}

module.exports = {
	get_profile,
	get_create_blog,
	get_followers,
	get_following,
	get_request_page
}