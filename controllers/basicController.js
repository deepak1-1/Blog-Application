
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const requestModel = require('../models/requestModel.ejs');
const notificationModel = require('../models/notificationModel.ejs');
const blogDataModel = require('../models/blogDataModel.ejs');
const commentDataModel = require('../models/commentModel.ejs')

function createtoken( username, key, timeInMin ){

    return jwt.sign( {username}, key, {
        expiresIn: 60*timeInMin
    })
}

// **************** main routes function **************

const get_login_page = (req, res)=> {

    const token = createtoken( 'Page', 'SignInUPForgetPassword', 5 )//in mins
    res.cookie('jwt', token,  { httpOnly: true, maxAge: 5*60*1000} ); 
    res.render('login/sign_in_up', {
        title: 'Sign in | Sign Up', 
        stylesheet: "css/loginCss.css"
    });
}

const get_about = (req, res) => {
    const sendData = {
        about: true,
        name: req.data.name,
        username: req.data.username,
        profilePath: req.data.profilePath
    }
    res.render('basic/about', {title: 'About', stylesheet: "css/index.css", sendData});
}

const get_home_page = async (req, res) => {

    await userDataModel.findOne({username: req.data.username}, async (err, data)=>{
        if(err){
            console.log(err);
        } else {

            const sendData = { homepage: true, 
                               username: req.data.username,
                               name: req.data.name, 
                               profilePath: req.data.profilePath, 
                               postsData: [] }
            data.following.push( req.data.username );
            const length = data.following.length;
            if(data.following.length !== 0){
                
                for(let i=0;i<length;i++){

                    await blogDataModel.find({ username: data.following[i], private: false}, (err, followingPosts)=>{

                        if(err){
                            console.log(err);
                        } else {

                            if(followingPosts.length !== 0){
                                followingPosts.forEach( async (followingPost)=>{

                                    const matchedTags = [];
                                    await data.tagsInterested.forEach( tag=>{
                                        if(followingPost.tags.includes(tag))
                                            matchedTags.push(tag)
                                    })
                                    if(matchedTags.length !== 0){

                                        let dateTime = String((new Date(Number(followingPost.createdTimestamp))));
                                        dateTime = dateTime.split(' ');
                                        dateTime = `${dateTime[2]}/${dateTime[1]}/${dateTime[3]} ${dateTime[4].slice(0,5)}`
                                        
                                        const appendData = {
                                            username: data.following[i],
                                            postId: followingPost.id,
                                            postTags: followingPost.tags,
                                            matchedTags: matchedTags,
                                            createdBy: followingPost.createdBy,
                                            dateTime,
                                            title: followingPost.title,
                                            imagesPath: followingPost.imagesPath,
                                            likesUsername: followingPost.likesUsername,
                                            data: followingPost.data
                                        }

                                        sendData.postsData.push( appendData )
                                        
                                        if((i+1) === length){

                                            console.log('2nd',sendData)
                                            res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
                                    
                                        }
                                    } else {

                                        if((i+1) === length){

                                            console.log('3rd',sendData)
                                            res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
                                    
                                        }

                                    }
                                })
                            } else {

                                console.log('4 th',sendData)
                                res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData})
                                    
                            }
                        }
                    })
                }
            } else {

                console.log('5th',sendData)
                res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData});
            }            
        }
    })
}

const log_out = (req, res)=> {

    res.cookie('jwtLoginAccess', '',  { maxAge: 1 });
    res.send( { logOut: true , redirect: '/'} )
}

const follow = (req, res)=>{

    requestModel.findOne( {sender: [req.data.username, req.data.name, req.data.profilePath],
                           receiver: [req.body.receiverUsername, req.body.name, req.body.profilePath]}, (err, data)=>{
                            if(err){
                                console.log('Error inside basicController follow: '+err);
                            } else {
                                if(data){
                                    res.send( {send: false, already: true} )
                                } else {

                                    const sendRequest = requestModel({
                                        sender: [req.data.username, req.data.name, req.data.profilePath],
                                        receiver: [req.body.receiverUsername, req.body.name, req.body.profilePath],
                                        accepted: false
                                    })

                                    sendRequest.save()
                                        .then(result =>{
                                            res.send( {send: true, already: false} )
                                        })
                                        .catch(err =>{
                                            res.send( {send: false, already: false} )
                                            console.log('Error inside basicController follow'+err);
                                        })
                                }
                            }
                           })
}

const unfollow = async (req, res)=>{

    let passFollowers = false, passFollowing = false;
    await userDataModel.updateOne({username: req.data.username}, {$pull: {following: req.body.username}}, (err, data)=>{
        if(err){
            console.log(err)
        } else {
            passFollowing = true;
        }
    })
    await userDataModel.updateOne({username: req.body.username}, {$pull: {followers: req.data.username}}, (err, data)=>{
        if(err){
            console.log(err)
        } else {
            passFollowers = true;
        }
    })

    sendNotification = notificationModel({
        username: req.body.username,
        data: {
            username: req.data.username,
            text: 'unfollowed you'
        },
        read: false
    })

    sendNotification.save()
        .then(result=>{
            if(passFollowers && passFollowing){
                res.send({unfollowed: true});
            } else {
                res.send({unfollowed: false});
            }
        })
        .catch(err=>{
            console.log(err);
        })

}

const cancel_request = (req, res)=>{

    requestModel.deleteMany( { sender: [req.data.username, req.data.name, req.data.profilePath],
                                        receiver: [req.body.receiverUsername, req.body.name, req.body.profilePath]}, (err, data)=>{
        if(err){
            console.log('Error inside basicController cancel_request');
            res.send( {cancel: false} )
        } else {
            res.send( {cancel: true} )
        }
    })
}

const accept_request = async (req, res) => {
    
    let accepted = false, addedFollower = false, addedFollowing = false;
    await requestModel.deleteMany( { sender: [req.body.username, req.body.name, req.body.profilePath],
                                        receiver: [req.data.username, req.data.name, req.data.profilePath]}, (err, data)=>{
        if(err){
            console.log('Error inside basicController cancel_request');
        } else {
            accepted = true;
        }
    })

    await userDataModel.updateOne({username: req.data.username}, 
                                  {$addToSet: {followers: req.body.username}},
                                  {upsert: false}, 
                                  (err, data)=>{
        if(err){
            console.log('Error Inside basicController cancel_request: '+err)
        } else {
            addedFollower = true;
        }
    })

    await userDataModel.updateOne({username: req.body.username}, 
                                  {$addToSet: {following: req.data.username}},
                                  {upsert: false}, 
                                  (err, data)=>{
        if(err){
            console.log('Error Inside basicController cancel_request: '+err)
        } else {
            addedFollowing = true;
        }
    })

    if(accepted && addedFollower && addedFollowing ){

        notification = notificationModel({
            username: req.body.username,
            data: {
                username: req.data.username,
                text: 'accepted your follow request!'
            },
            read: false
        })

        notification.save()
            .then( result =>{
                res.send( {accept: true} );
            })
            .catch(err => {
                console.log('Error inside basicController reject_request: '+err);
                res.send({accept: false});
            })
    }
}

const reject_request = async (req, res) => {
    
    let rejected = false;
    await requestModel.deleteMany( { sender: [req.body.username, req.body.name, req.body.profilePath],
                                        receiver: [req.data.username, req.data.name, req.data.profilePath]}, (err, data)=>{
        if(err){
            console.log('Error inside basicController cancel_request');
        } else {
            rejected = true;
        }
    })

    if(rejected){

        notification = notificationModel({
            username: req.body.username,
            data: {
                username: req.data.username,
                text: 'rejected your follow request!'
            },
            read: false
        })

        notification.save()
            .then( result =>{
                res.send( {reject: true} );
            })
            .catch(err => {
                console.log('Error inside basicController reject_request: '+err);
                res.send({reject: false});
            })
    }
}


const remove_follower = async (req, res)=>{

    let passFollowers = false, passFollowing = false;
    await userDataModel.updateOne({username: req.data.username}, {$pull: {followers: req.body.username}}, (err, data)=>{
        if(err){
            console.log(err)
        } else {
            passFollowers = true;
        }
    })
    await userDataModel.updateOne({username: req.body.username}, {$pull: {following: req.data.username}}, (err, data)=>{
        if(err){
            console.log(err)
        } else {
            passFollowing = true;
        }
    })

    sendNotification = notificationModel({
        username: req.body.username,
        data: {
            username: req.data.username,
            text: 'removed you from followers'
        },
        read: false
    })

    sendNotification.save()
        .then(result=>{
            if(passFollowers && passFollowing){
                res.send({removed: true});
            } else {
                res.send({removed: false});
            }
        })
        .catch(err=>{
            console.log(err);
        })
}

module.exports = {
    get_login_page,
    get_about,
    get_home_page,
    log_out,
    follow,
    unfollow,
    cancel_request,
    accept_request,
    reject_request,
    remove_follower

};