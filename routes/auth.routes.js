// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { protectUser } = require('../middleware/auth.middleware');

router.get('/captcha', authController.getCaptcha);

router.post('/register/request-otp', authController.requestRegistrationOtp);
router.post('/register/verify-otp', authController.verifyRegistrationOtp);
router.post('/register/complete', authController.completeRegistration);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/forgot-password/request-otp', authController.forgotPasswordRequestOtp);
router.post('/forgot-password/reset', authController.forgotPasswordReset);

router.post('/change-password', protectUser, authController.changePassword);

module.exports = router;
