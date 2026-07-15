// controller/profile.controller.js
const profileService = require('../service/profile.service');
const { uploadToCloudinary } = require('../utils/cloudinary');

const getMyProfile = async (req, res, next) => {
  try {
    const user = await profileService.getProfile(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const user = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    next(err);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const resumeUrl = await uploadToCloudinary(req.file.path, 'resumes');
    const user = await profileService.updateResume(req.user.id, resumeUrl);
    res.status(200).json({ success: true, message: 'Resume uploaded successfully', resumeUrl, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyProfile, updateMyProfile, uploadResume };
