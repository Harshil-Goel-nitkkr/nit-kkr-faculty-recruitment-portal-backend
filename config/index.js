// config/index.js
// Central place where all environment variables are read.
// Every other file in the backend should import config from here
// instead of accessing process.env directly.

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,

  mongoUri: process.env.MONGO_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminSecret: process.env.ADMIN_JWT_SECRET,
    adminExpiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d',
  },

  otp: {
    expiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 10),
  },

  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
    instituteContactEmail: process.env.INSTITUTE_CONTACT_EMAIL,
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
  },

  upload: {
    maxFileSizeMB: Number(process.env.MAX_FILE_SIZE_MB || 5),
    dir: 'uploads',
  },

  payment: {
    razorpay_keyId: process.env.RAZORPAY_KEY_ID,
    razorpay_keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  captcha: {
    redis_url : process.env.REDIS_URL,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

  },
 
  mailjet: {
    api_key_public: process.env.MAILJET_API_KEY_PUBLIC,
    api_key_private: process.env.MAILJET_API_KEY_PRIVATE,
  }
};

module.exports = config;
