
const mailer = require('nodemailer');
const loginDataModel = require('../models/signModel.ejs');
const bcrypt = require('bcrypt');

let userNamelist = [], beforeVerificationCode, userData;

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

// **************************** main router functions*******************

const fetch_username = (req, res) => {

    loginDataModel.find( {email : req.body.email}, (err, data)=>{
        userNamelist = [];
        if (err)
            console.log(err);
        else {

            data.forEach( eachdata => {
                userNamelist.push( eachdata.username )
            });
            res.send({ userNamelist });
        }
    });
};

const send_code = (req, res) => {

    beforeVerificationCode = genrateCode();
    mailOptions.text = `Your verification code is ${beforeVerificationCode}`;
    mailOptions.to = req.body.email;


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
        res.send( { redirect: '/forget-password/reset'} )
    
    } else {
        res.send( { redirect: false } )

    }
}

const reset_password = (req, res) => {
    
    console.log(req.body);
    loginDataModel.update(
        {'username': userData.username, 'email': userData.email}, //query
        {$set: {'password': req.body.password}}, // update
        {upsert: false},
        (err, data)=>{
            if(err){
                console.log(err);
            } else {
                console.log(data);
            }
        }
    )
}
module.exports = {
    fetch_username,
    send_code,
    verify_code,
    reset_password
}