
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const requestModel = require('../models/requestModel.ejs');
const notificationModel = require('../models/notificationModel.ejs');

function createtoken( username, key, timeInMin ){

    return jwt.sign( {username}, key, {
        expiresIn: 60*timeInMin
    })
}

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

const get_home_page = (req, res) => {
    console.log(req.data);
    // loginDataModel.findOne()
    userDataModel.findOne({username: req.data.username}, (err, data)=>{
        if(err){
            console.log(err);
        } else {
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
            let name = data.name;
            let intrestedTags = data.tagsInterested;

            const sendData = { homepage: true, name, profilePath }
            res.render('basic/index', {title: 'Home Page', stylesheet: '/css/index.css', sendData: sendData})
            
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

const unfollow = (req, res)=>{

    sendRequest()
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

module.exports = {
    get_login_page,
    get_about,
    get_home_page,
    log_out,
    follow,
    unfollow,
    cancel_request,
    accept_request,
    reject_request

};