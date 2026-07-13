// config/db.js
const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri);
    console.log('[DB] MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
