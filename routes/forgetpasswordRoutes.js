
const express = require('express');
const router = express.Router();
const forgetpasswordController = require('../controllers/forgetpasswordController');
const auth = require('../middleware/authMiddleware');


// router.get('/', auth.checkForSignInUpForgetPassword, forgetpasswordController.forget_password_page);
router.get('/', forgetpasswordController.forget_password_page);

// router.post('/check-user', auth.checkForForgetPassword, forgetpasswordController.check_user);
router.post('/check-user', forgetpasswordController.check_user);

// router.post( '/get-code', auth.checkForForgetPassword, forgetpasswordController.send_code);
router.post( '/get-code', forgetpasswordController.send_code);

// router.post( '/code-verification', auth.checkForForgetPassword, forgetpasswordController.verify_code);
router.post( '/code-verification', forgetpasswordController.verify_code);

// router.get( '/reset', auth.validForPasswordReset, (req, res) => {
//     res.render('forgetPassword/resetPasswordIndex', {title: 'Reset Password', stylesheet: false})
// });
router.get( '/reset', (req, res) => {
    res.render('forgetPassword/resetPasswordIndex', {title: 'Reset Password', stylesheet: false})
});

router.post( '/reset', forgetpasswordController.reset_password)

module.exports = router;