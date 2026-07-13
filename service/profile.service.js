// service/profile.service.js
const userRepository = require('../repository/user.repository');
const AppError = require('../utils/AppError');

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId).select('-password');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// email is intentionally excluded - it cannot be edited
const updateProfile = async (userId, data) => {
  const { email, password, ...allowedUpdates } = data;
  const user = await userRepository.updateById(userId, allowedUpdates);
  if (!user) throw new AppError('User not found', 404);
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const updateResume = async (userId, resumeUrl) => {
  const user = await userRepository.updateById(userId, { resumeUrl });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { getProfile, updateProfile, updateResume };
