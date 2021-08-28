
const express = require('express');
const router = express.Router();
const sign_in_upController = require('../controllers/sign_in_upController');


router.post('/check-user', sign_in_upController.check_user);

router.post('/login', sign_in_upController.user_login);

router.get('/sign-Up', sign_in_upController.register_user);

router.get('/verification', (req, res)=> {
    res.render('login/verificationCode', {title: 'Verification', stylesheet: 'css/verification.css'});
})

router.post('/verification', sign_in_upController.verify_code);

router.post('/get-code', sign_in_upController.create_and_send_code);

router.get('/get-code-again', sign_in_upController.create_and_send_code_again);


module.exports = router;