
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

const like = (req, res)=>{

    blogDataModel.updateOne({_id: req.body.postId}, {$addToSet: {likesUsername: req.data.username}}, (err, data)=>{

        if(err){
            console.log(err);
        } else {

            
            if(data.nModified === 1){
                res.send({like: true})
            } else {
                res.send({like: false})
            }
        }
    })
}

const dislike = (req, res)=>{

    blogDataModel.updateOne({_id: req.body.postId}, {$pull: {likesUsername: req.data.username}}, (err, data)=>{

        if(err){
            console.log(err);
        } else {
            if(data.nModified){
                
                res.send({dislike: true})
            } else {
                res.send({dislike: false})
            }
        }
    })
}

const show_user = (req, res)=>{

}

module.exports = {
    get_login_page,
    get_about,
    log_out,
    follow,
    unfollow,
    cancel_request,
    accept_request,
    reject_request,
    remove_follower,
    like,
    dislike,
    show_user

};