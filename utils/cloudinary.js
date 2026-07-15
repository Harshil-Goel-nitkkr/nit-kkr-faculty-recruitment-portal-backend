const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const config = require('../config');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key:    config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

/**
 * Upload a local file to Cloudinary, then delete it from disk.
 * localFilePath  - absolute path to the file on disk (req.file.path)
 * folder         - Cloudinary folder e.g. 'resumes', 'documents', 'offer-letters'
 * {Promise<string>}     - the secure Cloudinary URL
 */
const uploadToCloudinary = async (localFilePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'auto',   
    });
    return result.secure_url;  // full https://res.cloudinary.com/... URL
  } finally {
    // Always delete the local temp file whether upload succeeded or failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

module.exports = { uploadToCloudinary };