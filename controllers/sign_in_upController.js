
const mailer = require('nodemailer');
const loginDataModel = require('../models/signModel.ejs');
const bcrypt = require('bcrypt');

let before_verificationCode, after_verificationCode;
let userData;

function genrateCode(){
    var minm = 100000;
    var maxm = 999999;
    return (Math.floor(Math.random() * (maxm - minm + 1)) + minm);
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
            res.send({
                error: false,
                redirect: '/verification'
            });
        }
    })
}


const verify_code = (req, res) => {
    const verificationCode = req.body.verificationCode;
    if (verificationCode.length === 6){

        if(Number( verificationCode ) === userData.before_verificationCode){
            res.send( {redirect: '/sign-Up', error: false} )
        } else {
            res.send( {error: 'Code don\'t match'} )
        }

    } else if( (verificationCode.length < 6) ){
        res.send({ error: 'less number of digits' })
    } else if( (verificationCode.length > 6) ){
        res.send({ error: 'more number of digits'})
    }

}


const check_user = (req, res) => {
    
    loginDataModel.find({'username': req.body.userName}, (err, user)=>{
        if(err){
            console.log(err);
        } else {
            if (user.length === 0)
                res.send({message: 'NO'});
            else 
                res.send( {message: 'YES' });
        }
    });
}

const register_user = (req, res) => {

    const register = loginDataModel({
        username: userData.data.userName,
        email: userData.data.email,
        password: userData.data.password
    })

    register.save()
    .then(result=>{
        res.redirect('/') ;
    })
    .catch(err=>{
        console.log(err);
    })
}


const user_login = (req, res) => {

    loginDataModel.find( { 'username': req.body.username }, (error, user)=>{
        if( error){
            console.log(error);
        } else {
            if (user.length === 0){
                res.send({ userfound: false, match: false });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, isMatch)=>{
                    if (err){
                        console.log(err);
                    } else if (!isMatch) {
                        res.send({ userfound: true, match: false });
                    } else {
                        res.send({ userfound: true, match: true , redirect: ''})
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

