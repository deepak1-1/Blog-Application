
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const requestModel = require('../models/requestModel.ejs');

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
    res.render('basic/about', {title: 'About', stylesheet: "css/styles.css"});
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

    const sendRequest = requestModel({
        sender: req.data.username,
        receiver: req.body.receiverUsername,
        accepted: false
    })

    sendRequest.save()
        .then(result =>{
            res.send( {send: true} )
        })
        .catch(err =>{
            res.send( {send: false} )
            console.log('Error inside basicController follow'+err);
        })
}

const unfollow = (req, res)=>{

    sendRequest()
}

const cancel_request = (req, res)=>{

    requestModel.deleteMany( { sender: req.data.username, receiver: req.body.receiverUsername}, (err, data)=>{
        if(err){
            console.log('Error inside basicController cancel_request');
            res.send( {cancel: false} )
        } else {
            
            res.send( {cancel: true} )
        }
    })
}

module.exports = {
    get_login_page,
    get_about,
    get_home_page,
    log_out,
    follow,
    unfollow,
    cancel_request

};