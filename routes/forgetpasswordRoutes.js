
const express = require('express');
const router = express.Router();
const forgetpasswordController = require('../controllers/forgetpasswordController');


router.get('/', (req, res) => {
    res.render('forgetPassword/forgetPasswordindex', {title: 'forget Password', stylesheet: 'css/forgetPassword.css'});
});

router.post('/fetch-username', forgetpasswordController.fetch_username);

router.post( '/get-code', forgetpasswordController.send_code);

router.post( '/code-verification', forgetpasswordController.verify_code);

router.get( '/reset', (req, res) => {
    res.render('forgetPassword/resetPasswordIndex', {title: 'Reset Password', stylesheet: false})
});

router.post( '/reset', forgetpasswordController.reset_password)

module.exports = router;