const jwt = require('jsonwebtoken');



const checkForSignInUpForgetPassword = (req, res, next) =>{

	const token = req.cookies.jwt;
	console.log('Inside middleware');
	if(token){
		console.log(token);
		jwt.verify(token, 'SignInUPForgetPassword', (err, decodedToken)=>{
			if(err){
				console.log(err);
				res.redirect('/');
			} else {
				next();
			}
		})
	} else {
		console.log(token);
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

		jwt.verify(token, 'LoginAcess', (err, decodedToken)=>{
			if(err){
				if(req.url !== '/'){
					res.redirect('/');
				} else {
					next()
				}
			} else {
				if(req.url === '/'){
					req.data = {username: decodedToken.data.username, name: decodedToken.data.name, profilePath: decodedToken.data.profilePath, login: true}
					res.redirect('/home-page')
				} else{
					req.data = {username: decodedToken.data.username, name: decodedToken.data.name, profilePath: decodedToken.data.profilePath, login: true};
					next();		
				}
			}
		})
	} else {
		if(req.url !== '/'){
			res.redirect('/');
		} else {
			next()
		}
	}

}


const checkRegisterAccess = (req, res, next) =>{

	const token = req.cookies.jwtRegister;
	if(token){

		jwt.verify(token, 'ValidRegisteration', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				req.data = decodedToken.username ;
				next();
			}
		})
	} else {
		res.redirect('/');
	}

}

const checkProfileUpload = (req, res, next) =>{

	const token = req.cookies.jwtProfilePhoto;
	if(token){

		jwt.verify(token, 'ValidUpload', (err, decodedToken)=>{
			if(err){
				res.redirect('/');
			} else {
				req.data = {username: decodedToken.data.username, name: decodedToken.data.name} ;
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
	checkRegisterAccess,
	checkProfileUpload
}