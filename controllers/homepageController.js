
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const requestModel = require('../models/requestModel.ejs');
const notificationModel = require('../models/notificationModel.ejs');
const blogDataModel = require('../models/blogDataModel.ejs');

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


const get_home_page = async (req, res) => {

    // userDataModel.findOne({username: req.data.username}, (err, data)=>{
    //     if(err){
    //         console.log(err);
    //     } else {

    //         const sendData = { homepage: true, 
    //                            username: req.data.username,
    //                            name: req.data.name, 
    //                            profilePath: req.data.profilePath, 
    //                            postsData: [] }
    //         data.following.push( req.data.username );
    //         const length = data.following.length;
    //         if(data.following.length !== 0){
                
    //             for(let i=0;i<length;i++){

    //                 blogDataModel.find({ username: data.following[i], private: false}, (err, followingPosts)=>{

    //                     if(err){
    //                         console.log(err);
    //                     } else {

    //                         if(followingPosts.length !== 0){
    //                             followingPosts.forEach( (followingPost)=>{

    //                                 const matchedTags = [];
    //                                 data.tagsInterested.forEach( tag=>{
    //                                     if(followingPost.tags.includes(tag))
    //                                         matchedTags.push(tag)
    //                                 })
    //                                 if(matchedTags.length !== 0){

    //                                     let dateTime = String((new Date(Number(followingPost.createdTimestamp))));
    //                                     dateTime = dateTime.split(' ');
    //                                     dateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`
                                        
    //                                     const appendData = {
    //                                         username: data.following[i],
    //                                         postId: followingPost.id,
    //                                         postTags: followingPost.tags,
    //                                         matchedTags: matchedTags,
    //                                         createdBy: followingPost.createdBy,
    //                                         dateTime,
    //                                         title: followingPost.title,
    //                                         imagesPath: followingPost.imagesPath,
    //                                         likesUsername: followingPost.likesUsername,
    //                                         data: followingPost.data
    //                                     }

    //                                     sendData.postsData.push( appendData )
                                        
    //                                     if((i+1) === length){

    //                                         console.log('2nd',sendData)
    //                                         res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
                                    
    //                                     }
    //                                 } else {

    //                                     if((i+1) === length){

    //                                         console.log('3rd',sendData)
    //                                         res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
                                    
    //                                     }

    //                                 }
    //                             })
    //                         } else {

    //                             console.log('4 th',sendData)
    //                             res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
                                    
    //                         }
    //                     }
    //                 })
    //             }
    //         } else {

    //             console.log('5th',sendData)
    //             res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData});
    //         }            
    //     }
    // })

    let postsData = await blogDataModel.find({private:false})

    const sendData = { homepage: true, 
                       username: req.data.username,
                       name: req.data.name, 
                       profilePath: req.data.profilePath, 
                       postsData: [] }
    if(postsData){
        
        let dataLen = postsData.length, j=0;

        for(let i=0; i<dataLen; i++){

            let dateTime = String((new Date(Number(postsData[i].createdTimestamp))));
            dateTime = dateTime.split(' ');
            dateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`
            
            const appendData = {
                username: postsData[i].username,
                postId: postsData[i].id,
                postTags: postsData[i].tags,
                createdBy: postsData[i].createdBy,
                dateTime,
                title: postsData[i].title,
                imagesPath: postsData[i].imagesPath,
                likesUsername: postsData[i].likesUsername,
                data: postsData[i].data,
                comments: postsData[i].comments
            }

            sendData.postsData.push( appendData )

            if(j === (dataLen-1)){
                res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
            }
            j++;
        }
    } else {
        console.log(postsData);
        res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
        
    }
}



const get_profile = (req, res)=>{

	userDataModel.findOne( {username: req.data.username}, (err, data)=>{

		let profilePath = returnProfilePath(data)
		
		let followers = data.followers.length, 
			following = data.following.length,
			gender = data.gender,
			totalposts = data.posts.length + data.privatePosts.length,
			name = data.name,
			bio = data.bio;
		let date = String(new Date(data.dob)).split(' ');
			dob = `${date[2]} ${date[1]} ${date[3]}`;

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
			accountCreated,
			dob,
			bio
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

	const sendData = {
					username: req.data.username,
					name: req.data.name,
					profile: true,
					profilePath: req.data.profilePath,
					followers: false
				};
	await userDataModel.findOne( { username: req.data.username }, async (err, data)=>{
		if(err){
			console.log('Error inside homepage controller get_followers'+err);
		} else {
			if(data.followers.length !== 0){
				sendData.followers = [];
				let datalen = data.followers.length;

				for(let i=0; i< datalen;i++){
					await userDataModel.findOne( {username: data.followers[i]}, (err, followerData)=>{
						
						if(err){
							console.log('Error inside homepageController get_followers: '+err);
						} else {
							const appendData = {
								name: followerData.name,
								username: followerData.username,
								profilePath: returnProfilePath( followerData )
							}
							sendData.followers.push( appendData );
						}
					} )

					if((i+1) === datalen){
						res.render('homepage/followers', { title: 'Followers', stylesheet: '/css/index.css', sendData});
					}

				};
			} else {
				res.render('homepage/followers', { title: 'Followers', stylesheet: '/css/index.css', sendData});
			} 
		}
	})
}

const get_following = async (req, res) => {

	let sendData, loginData, userFollowing, userFollowers;
	await userDataModel.findOne( {username: req.data.username}, async (err,data)=>{
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

				await data.following.forEach(eachFollowing => {
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
								if(!userFollowing.includes(loginData[i].username)){
									const appendData = {
										username: suggestionData.username,
										name: suggestionData.name,
										profilePath: returnProfilePath(suggestionData)
									}
									sendData.suggestion.push(appendData);
								}
							}
						}
					} )
			}
			i++;
		}
	}
	res.render('homepage/following', {title: 'Following', stylesheet: '/css/index.css', sendData})
}

const get_request_page = async (req, res)=>{

	let requestData;

	const sendData = {
		request: true,
		name: req.data.name,
		username: req.data.username,
		profilePath: req.data.profilePath,
		requestSend: [],
		requestReceived: []
	}

	await requestModel.find({receiver: req.data.username}, (err, data)=>{
		if(err){
			console.log('Error inside homepageController get_request_page: '+ err);
		} else {
			if(data.length !== 0){

				data.forEach( eachData =>{

					const dateTime = String(eachData.createdAt).split(' ');
					const formattedDateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`

					const pushData = {
						userData: eachData.sender,
						dateTime: formattedDateTime
					}

					sendData.requestReceived.push( pushData );
				})

			} else {
				sendData.requestReceived = false;
			}
		}
	})

	await requestModel.find({sender: req.data.username}, (err, data)=>{
		if(err){
			console.log('Error inside homepageController get_request_page: '+ err);
		} else {
			if(data.length !== 0){

				data.forEach( eachData =>{

					const dateTime = String(eachData.createdAt).split(' ');
					const formattedDateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`

					const pushData = {
						userData: eachData.receiver,
						dateTime: formattedDateTime
					}

					sendData.requestSend.push( pushData );
				})

			} else {
				sendData.requestSend = false;
			}
		}
	})
	res.render('homepage/request', {title: 'Requests', stylesheet: '/css/index.css', sendData});
}

const get_notification_page = async (req, res)=>{

	const sendData = {
		notification: true,
		name: req.data.name,
		profilePath: req.data.profilePath,
		username: req.data.username,
		notification: false
	}
	let daysBackDate = new Date();
	daysBackDate.setDate( daysBackDate.getDate() - 7);

	await notificationModel.find( {username: req.data.username}, async (err, data)=>{
		if(err){
			console.log('Error inside homepageController get_notification_page: '+err);
		} else {
			if(data.length !== 0){
				sendData.notification = [];
				await data.forEach( eachData=>{
					notificationDate = new Date(String(eachData.createdAt))
					if(notificationDate>=daysBackDate){
						
						notificationDate = String(notificationDate).split(' ');
						notificationDate = `${notificationDate[2]}/${notificationDate[1]}/${notificationDate[3]} ${notificationDate[4].slice(0,5)}`
						const appendData = {
							read: eachData.read,
							username: eachData.data.username,
							text: eachData.data.text,
							dateTime: notificationDate
						}

						sendData.notification.push(appendData);
					} 
				})
				res.render('homepage/notification', {title: 'Notification', stylesheet: '/css/index.css', sendData});
			} else {
				res.render('homepage/notification', {title: 'Notification', stylesheet: '/css/index.css', sendData});
			}
		}
	})


}

const get_private_posts = async (req, res)=>{

	const sendData = {
		privatePost: true,
		username: req.data.username,
		name: req.data.name,
		profilePath: req.data.profilePath,
		privatePosts: []
	}

	blogDataModel.find({username: req.data.username, private: true},(err, data)=>{
		if(err){
			console.log(err);
		} else {
			data.forEach( eachPost=>{

				let dateTime = String((new Date(Number(eachPost.createdTimestamp))));
                dateTime = dateTime.split(' ');
                dateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`
                

				const appendData = {
                            username: req.data.username,
                            postId: eachPost.id,
                            postTags: eachPost.tags,
                            createdBy: eachPost.createdBy,
                            dateTime,
                            title: eachPost.title,
                            imagesPath: eachPost.imagesPath,
                            likesUsername: eachPost.likesUsername,
                            data: eachPost.data
                        }
                sendData.privatePosts.push( appendData );
			})

			res.render('homepage/privatePosts', {title: 'Private Post', stylesheet: '/css/index.css', sendData});
		}
	})
}

const get_posts = async (req, res)=>{

	const sendData = {
		profile: true,
		username: req.data.username,
		name: req.data.name,
		profilePath: req.data.profilePath,
		posts: []
	}

	let fetchedPostData = await blogDataModel.find({username: req.data.username, private: false})

	if(fetchedPostData){

		fetchedPostData.forEach( eachPost=>{

			let dateTime = String((new Date(Number(eachPost.createdTimestamp))));
                dateTime = dateTime.split(' ');
                dateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`
                

				const appendData = {
                            username: req.data.username,
                            postId: eachPost.id,
                            postTags: eachPost.tags,
                            createdBy: eachPost.createdBy,
                            dateTime,
                            title: eachPost.title,
                            imagesPath: eachPost.imagesPath,
                            likesUsername: eachPost.likesUsername,
                            data: eachPost.data
                        }
                sendData.posts.push( appendData );

		})

		// console.log(sendData)
		res.render('homepage/posts', {title: 'My Posts', stylesheet: '/css/index.css', sendData});
	} else {
		console.log('Some Error inside get_posts homepageController');
		res.render('homepage/posts', {title: 'My Posts', stylesheet: '/css/index.css', sendData});
	}
}


const delete_post = async (req, res)=>{

	let post_deleted = await blogDataModel.deleteOne({_id: req.body.postId})
	// let comment_deleted
	if(req.body.private){
		let removed_from_data = await userDataModel.updateOne({username: req.data.username}, {$pull: {privatePosts: req.body.postId}})
		if(post_deleted.deletedCount && removed_from_data.nModified){
			res.send({deleted: true})
		} else {
			res.send({deleted: false})
		}
	} else {
		let removed_from_data = await userDataModel.updateOne({username: req.data.username}, {$pull: {posts: req.body.postId}})
		if(post_deleted.deletedCount && removed_from_data.nModified){
			res.send({deleted: true})
		} else {
			res.send({deleted: false})
		}
	}

}

module.exports = {
	get_home_page,
	get_profile,
	get_create_blog,
	get_followers,
	get_following,
	get_request_page,
	get_notification_page,
	get_private_posts,
	get_posts,
	delete_post
}