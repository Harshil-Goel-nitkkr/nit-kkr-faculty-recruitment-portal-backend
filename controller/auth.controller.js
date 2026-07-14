// controller/auth.controller.js
const authService = require('../service/auth.service');
const captchaService = require('../service/captcha.service');

const getCaptcha = async (req, res, next) => {
  try {
    const { captchaId, svg } = await captchaService.generateCaptcha();
    res.status(200).json({ success: true, captchaId, svg });
  } catch (err) {
    next(err);
  }
};

const requestRegistrationOtp = async (req, res, next) => {
  try {
    const { email, captchaId, captchaInput } = req.body;
    if (!email || !captchaId || !captchaInput) {
      return res.status(400).json({ success: false, message: 'Email and captcha are required' });
    }
    const isCaptchaValid = captchaService.verifyCaptcha(captchaId, captchaInput);
    if (!isCaptchaValid) {
      return res.status(400).json({ success: false, message: 'Incorrect captcha. Please try again.' });
    }
    const result = await authService.sendRegistrationOtp(email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const verifyRegistrationOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    const result = await authService.verifyRegistrationOtp(email, otp);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const completeRegistration = async (req, res, next) => {
  try {
    const result = await authService.completeRegistration(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, captchaId, captchaInput } = req.body;
    if (!email || !password || !captchaId || !captchaInput) {
      return res.status(400).json({ success: false, message: 'Email, password and captcha are required' });
    }
    const isCaptchaValid = await captchaService.verifyCaptcha(captchaId, captchaInput);
    if (!isCaptchaValid) {
      return res.status(400).json({ success: false, message: 'Incorrect captcha. Please try again.' });
    }
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordRequestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const result = await authService.sendForgotPasswordOtp(email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const forgotPasswordReset = async (req, res, next) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;
    if (!email || !otp || !newPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required and passwords must match' });
    }
    const result = await authService.resetPasswordWithOtp(email, otp, newPassword);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
      confirmNewPassword
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCaptcha,
  requestRegistrationOtp,
  verifyRegistrationOtp,
  completeRegistration,
  login,
  forgotPasswordRequestOtp,
  forgotPasswordReset,
  changePassword,
};
