const jwt = require('jsonwebtoken');



const checkForSignInUpForgetPassword = (req, res, next) =>{

	const token = req.cookies.jwt;
	if(token){

		jwt.verify(token, 'SignInUPForgetPassword', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		res.redirect('/');
	}

}


const checkSignUptoken = ( req, res, next ) => {

	const token = req.cookies.jwtRegister;
	if(token){

		jwt.verify(token, 'blogSignUp', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		res.redirect('/');
	}
}

const checkUserValidForVerification = (req, res, next) =>{

	const token = req.cookies.jwtAccessVerification;
	if(token){

		jwt.verify(token, 'AccessVerification', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		res.redirect('/');
	}
}

const validForPasswordReset = (req, res, next) =>{

	const token = req.cookies.jwtResetPassword;
	if(token){

		jwt.verify(token, 'ResetPassword', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		res.redirect('/');
	}

}

const checkForForgetPassword = (req, res, next) =>{

	const token = req.cookies.jwtForgetPassword;
	if(token){

		jwt.verify(token, 'ForgetPassword', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		res.redirect('/');
	}
}


const checkLoginAccess = (req, res, next) =>{

	const token = req.cookies.jwtLoginAccess;
	if(token){

		jwt.verify(token, 'UserAccess', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		res.redirect('/');
	}

}


const checkRegisterAccess = (req, res, next) =>{

	const token = req.cookies.jwtRegister;
	if(token){

		jwt.verify(token, 'ValidRegisteration', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				// console.log(req.body, decodedToken.username)
				req.data = decodedToken.username ;
				next();
			}
		})
	} else {
		res.redirect('/');
	}

}

module.exports = {
	checkForSignInUpForgetPassword,
	checkSignUptoken,
	checkUserValidForVerification,
	checkForForgetPassword,
	validForPasswordReset,
	checkLoginAccess,
	checkRegisterAccess
}