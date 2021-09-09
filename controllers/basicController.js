
const jwt = require('jsonwebtoken');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');

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
module.exports = {
    get_login_page,
    get_about,
    get_home_page

};