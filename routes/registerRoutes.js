
const express = require('express');
const router = express.Router();
const sign_in_upController = require('../controllers/registerController');
const auth = require('../middleware/authMiddleware');



router.get( '/',  (req, res)=>{
	res.render('register/personalDetails', {title: 'Personal Details', 
							stylesheet: false,
							data: {
								email: 'deepaktewatia049@gmail.com',
								username: 'deesdpak'
							}
				});
} );


router.post('/', sign_in_upController.InsertUser);
// router.get('/', auth.checkRegisterAccess, (req, res)=>{
// 	console.log(req.data);
// 	res.render('register/personalDetails', {title: 'Personal Details', stylesheet: false});
// })


module.exports = router;
