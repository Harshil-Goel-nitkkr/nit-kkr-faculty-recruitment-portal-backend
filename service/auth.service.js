// service/auth.service.js
const bcrypt = require('bcryptjs');
const userRepository = require('../repository/user.repository');
const otpRepository = require('../repository/otp.repository');
const { sendMail } = require('../config/mailer');
const config = require('../config');
const generateOtp = require('../utils/generateOtp');
const { signUserToken } = require('../utils/token');
const AppError = require('../utils/AppError');

// Step 1 of registration: validate email isn't already used, generate + email OTP
const sendRegistrationOtp = async (email) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('An account with this email already exists. Please login.', 409);
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

  await otpRepository.deleteAllForEmail(email, 'REGISTER');
  await otpRepository.create({ email, otp, purpose: 'REGISTER', expiresAt });

  await sendMail({
    to: email,
    subject: 'NIT Kurukshetra Recruitment Portal - Email Verification OTP',
    html: `<p>Your OTP for email verification is <b>${otp}</b>. It is valid for ${config.otp.expiryMinutes} minutes.</p>`,
  });

  return { message: 'OTP sent to your email' };
};

const verifyRegistrationOtp = async (email, otp) => {
  const record = await otpRepository.findLatestValid(email, 'REGISTER');
  if (!record) throw new AppError('OTP not found or already used. Please request a new one.', 400);
  if (record.expiresAt < new Date()) throw new AppError('OTP has expired. Please request a new one.', 400);
  if (record.otp !== otp) throw new AppError('Incorrect OTP', 400);

  await otpRepository.markVerified(record._id);
  return { message: 'Email verified successfully' };
};

// Step 2: complete registration with full profile form, after OTP has been verified
const completeRegistration = async (data) => {
  const { email, password, confirmPassword } = data;

  if (password !== confirmPassword) throw new AppError('Passwords do not match', 400);

  const verifiedOtp = await otpRepository.findLatestValid(email, 'REGISTER');
  // after markVerified, verified=true, so findLatestValid (verified:false) returns null.
  // We re-check using a direct query to ensure verification truly happened.
  const Otp = require('../schema/Otp.schema');
  const wasVerified = await Otp.findOne({ email: email.toLowerCase(), purpose: 'REGISTER', verified: true }).sort({ createdAt: -1 });
  if (!wasVerified) throw new AppError('Please verify your email with OTP before registering', 400);

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new AppError('An account with this email already exists', 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email,
    password: hashedPassword,
    phoneNo: data.phoneNo,
    address: data.address,
    dob: data.dob,
    fatherName: data.fatherName,
    isEmailVerified: true,
  });

  await otpRepository.deleteAllForEmail(email, 'REGISTER');

  return { message: 'Registration successful. Please login.', userId: user._id };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Your account has been deactivated. Contact the institute.', 403);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = signUserToken({ id: user._id, email: user.email });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};

const sendForgotPasswordOtp = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('No account found with this email', 404);

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

  await otpRepository.deleteAllForEmail(email, 'FORGOT_PASSWORD');
  await otpRepository.create({ email, otp, purpose: 'FORGOT_PASSWORD', expiresAt });

  await sendMail({
    to: email,
    subject: 'NIT Kurukshetra Recruitment Portal - Password Reset OTP',
    html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for ${config.otp.expiryMinutes} minutes.</p>`,
  });

  return { message: 'OTP sent to your email' };
};

const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const record = await otpRepository.findLatestValid(email, 'FORGOT_PASSWORD');
  if (!record) throw new AppError('OTP not found or already used', 400);
  if (record.expiresAt < new Date()) throw new AppError('OTP has expired', 400);
  if (record.otp !== otp) throw new AppError('Incorrect OTP', 400);

  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('No account found with this email', 404);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(user._id, hashedPassword);
  await otpRepository.markVerified(record._id);
  await otpRepository.deleteAllForEmail(email, 'FORGOT_PASSWORD');

  return { message: 'Password reset successfully. Please login with your new password.' };
};

const changePassword = async (userId, currentPassword, newPassword, confirmNewPassword) => {
  if (newPassword !== confirmNewPassword) throw new AppError('New passwords do not match', 400);

  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(userId, hashedPassword);

  return { message: 'Password updated successfully' };
};

module.exports = {
  sendRegistrationOtp,
  verifyRegistrationOtp,
  completeRegistration,
  login,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  changePassword,
};
