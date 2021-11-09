
const mailer = require('nodemailer');
const loginDataModel = require('../models/signModel.ejs');
const userDataModel = require('../models/userDataModel.ejs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let before_verificationCode, after_verificationCode;
let userData;

function genrateCode(){
    var minm = 100000;
    var maxm = 999999;
    return (Math.floor(Math.random() * (maxm - minm + 1)) + minm);
}

function createtoken( username, key, timeInMin ){

    return jwt.sign( {username}, key, {
        expiresIn: 60*timeInMin
    })
}

function createLoginToken( data, key, timeInMin ){

    return jwt.sign( {data}, key, {
        expiresIn: 60*timeInMin
    })
}

const transporter = mailer.createTransport({
    service: 'gmail',
    auth : {
        user: 'deepaktewatia049@gmail.com',
        pass: 'deepak@121'
    }
});

const mailOptions = {
    from: 'deepaktewatia049@gmail.com',
    to: ``,
    subject: 'Your verification code',
    text: ``
}


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


// ***************** main route function ***************

const create_and_send_code  = (req, res) => {


    before_verificationCode = genrateCode();
    mailOptions.text = `Your verification code is ${before_verificationCode}`;
    mailOptions.to = req.body.email;


    transporter.sendMail( mailOptions, (err, info)=> {
        if(err){
            res.send( { error:err });
        } else {
            userData = {
                before_verificationCode,
                data: req.body
            }
            const token = createtoken( req.body.userName, 'AccessVerification', 5 )//in mins
            res.cookie('jwtAccessVerification', token,  { httpOnly: true, maxAge: 5*60*1000} ); 
            res.send({
                error: false,
                redirect: '/verification'
            });
        }
    })
}


const verify_code = (req, res) => {

    try {
        const verificationCode = req.body.verificationCode;
        if (verificationCode.length === 6){

            if(Number( verificationCode ) === userData.before_verificationCode){
                res.send( {redirect: '/sign-Up', error: false} )
            } else {
                res.send( {redirect: false, error: 'Code don\'t match'} )
            }

        } else if( (verificationCode.length < 6) ){
            res.send({ error: 'less number of digits' })
        } else if( (verificationCode.length > 6) ){
            res.send({ error: 'more number of digits'})
        }
    } catch( err ){
        console.log(err.message);
        res.send( {redirect:'/', error: 'register yourself!'});
    }
}


const check_user = async (req, res) => {

    console.log('Inside user');

    const resData = {'found': false, 'limitExceed': false}

    await loginDataModel.find({'email': req.body.email}, (err, data)=>{

        if (err){
            console.log(err);
        } else {
            if(data.length >= 5){
                resData.limitExceed = true;
            }
        }
    });

    await loginDataModel.find( {'username': req.body.userName}, (err, data)=>{
        if(err){
            console.log(err);
        } else {
            if(data.length !== 0){
                resData.found = true;
            }
        }
    })
    res.cookie('jwt', '', {maxAge:1});
    res.send( resData );
}

const register_user = (req, res) => {

    try{

        const register = loginDataModel({
            username: userData.data.userName,
            email: userData.data.email,
            password: userData.data.password
        })

        register.save()
        .then(result=>{
            let username = userData.data.userName;
            userData = {};
            const token = createtoken( username, 'ValidRegisteration', 60 )//in mins
            res.cookie('jwtAccessVerification', '', {maxAge: 1});
            res.cookie('jwtRegister', token,  { httpOnly: true, maxAge: 60*60*1000} ); 
            res.send( {redirect: '/register', error:false} );
        })
        .catch(err=>{
            console.log(err.message);
        })
    } catch(error){
        console.log(error.message);
        // res.send({redirect:'/', error:"Pleae go through process"});
        res.redirect('/');
    }
}


const user_login = (req, res) => {

    console.log('Inside login')

    loginDataModel.findOne( { 'username': req.body.username }, (error, data)=>{
        if( error){
            console.log(error);
        } else {
            if (!data){
                res.send({ userfound: false, match: false });
            } else {
                bcrypt.compare(req.body.password, data.password, (err, isMatch)=>{
                    if (err){
                        console.log(err);
                    } else if (!isMatch) {
                        res.send({ userfound: true, match: false });
                    } else {

                        userDataModel.findOne( {username: req.body.username}, (err, data)=>{
                            if(err){
                                console.log("Error inside User Login: "+err)
                            } else {
                                if(data){
                                    res.cookie('jwt', '', {maxAge:1});
                                    if(req.body.rememberADay){
                                        const token = createLoginToken( {username:req.body.username, name:data.name, profilePath: returnProfilePath(data)}, 'LoginAcess', 24*60 )//in mins
                                        res.cookie('jwtLoginAccess', token,  { httpOnly: true, maxAge: 24*60*60*1000} ); 

                                    }else {
                                        const token = createLoginToken( {username:req.body.username, name:data.name, profilePath: returnProfilePath(data)}, 'LoginAcess', 24*60)//in mins
                                        res.cookie('jwtLoginAccess', token);
                                    }
                                    res.send({ userfound: true, match: true , redirect: '/home-page'})

                                } else {
                                    //work with registeration
                                    const token = createtoken( req.body.username, 'ValidRegisteration', 60 )//in mins
                                    res.cookie('jwtRegister', token,  { httpOnly: true, maxAge: 60*60*1000} );
                                    res.send({ userfound: true, match: true ,redirect: '/register'})
                                }
                            }
                        })
                        
                    }
                })
            }
        }
    })

}

const create_and_send_code_again  = (req, res) => {


    before_verificationCode = genrateCode();
    mailOptions.text = `Your verification code is ${before_verificationCode}`;

    transporter.sendMail( mailOptions, (err, info)=> {
        if(err){
            console.log(err);
        } else {
            userData.before_verificationCode = before_verificationCode;
            res.send({
                send: true
            });
        }
    })
}

module.exports = {
    create_and_send_code,
    verify_code,
    check_user,
    register_user,
    user_login,
    create_and_send_code_again
}

