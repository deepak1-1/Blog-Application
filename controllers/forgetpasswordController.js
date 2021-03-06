
const mailer = require('nodemailer');
const loginDataModel = require('../models/signModel.ejs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


let beforeVerificationCode, userData;

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


const transporter = mailer.createTransport({
    service: 'gmail',
    auth : {
        user: 'deepaktewatia049@gmail.com',
        pass: 'Deepak@121'
    }
});

const mailOptions = {
    from: 'deepaktewatia049@gmail.com',
    to: ``,
    subject: 'Your verification code',
    text: ``
}

// **************************** main router functions*******************


const forget_password_page = (req, res) =>{

    const token = createtoken( 'Page', 'ForgetPassword', 5 )//in mins
    res.cookie('jwt', '', {maxAge: 1});
    res.cookie('jwtForgetPassword', token,  { httpOnly: true, maxAge: 5*60*1000} ); 
    res.render('forgetPassword/forgetPasswordindex', {title: 'forget Password', stylesheet: 'css/forgetPassword.css'});
}

const check_user = (req, res) => {

    loginDataModel.find( {email : req.body.email}, (err, data)=>{
        
        if(err){
            console.log(err);
        } else{

            let resData = { email :false, username: false };
            if(data.length !== 0){
                resData.email = req.body.email;
                data.forEach(element => {
                    if( element.username === req.body.username)
                        resData.username = req.body.username;
                });
            }
            res.send( resData );
        }
    });
};

const send_code = (req, res) => {

    beforeVerificationCode = genrateCode();
    mailOptions.text = `Your verification code is ${beforeVerificationCode}`;
    mailOptions.to = req.body.data.email;
    
    transporter.sendMail( mailOptions, (err, info)=> {
        if(err){
            console.log(err);
        } else {
            res.send( {codeSend: true } );
        }
    })

}

const verify_code = (req, res)=>{

    if(req.body.verificationCode === beforeVerificationCode){

        userData = req.body;// { email, username, verificationCode}

        res.cookie('jwtForgetPassword', '',  { maxAge: 1} ); 
        const token = createtoken( req.body.userName, 'ResetPassword', 5 )//in mins
        res.cookie('jwtResetPassword', token,  { httpOnly: true, maxAge: 5*60*1000} ); 
        res.send( { redirect: '/forget-password/reset'} )
    
    } else {
        res.send( { redirect: false } )

    }
}

const reset_password = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    loginDataModel.updateOne(
        {'username': userData.username, 'email': userData.email}, //query
        {$set: {'password': hashPassword}}, // update
        {upsert: false},
        (err, data)=>{
            if(err){
                console.log(err);
            } else {
                res.cookie('jwtResetPassword', '', {maxAge: 1});
                res.send( {ok: data.ok, redirect: '/'});
            }
        }
    )
}
module.exports = {
    forget_password_page,
    check_user,
    send_code,
    verify_code,
    reset_password
}