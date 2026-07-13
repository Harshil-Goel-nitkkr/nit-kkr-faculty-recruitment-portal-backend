// utils/seedSuperAdmin.js
// Run with: node utils/seedSuperAdmin.js
// Creates the first SUPER_ADMIN account so you can log in to the admin panel
// and use "Add Admin" to create further admins afterwards.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config/index');
const Admin = require('../schema/Admin.schema');

const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL || 'superadmin@nitkkr.ac.in';
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@123';
const SEED_NAME = process.env.SEED_ADMIN_NAME || 'Super Admin';

(async () => {
  try {
    await mongoose.connect(config.mongoUri);
    const existing = await Admin.findOne({ email: SEED_EMAIL.toLowerCase() });
    if (existing) {
      console.log('Super admin already exists:', SEED_EMAIL);
      process.exit(0);
    }
    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
    await Admin.create({
      name: SEED_NAME,
      email: SEED_EMAIL,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    });
    console.log('Super admin created successfully.');
    console.log('Email:', SEED_EMAIL);
    console.log('Password:', SEED_PASSWORD);
    console.log('IMPORTANT: change this password after first login.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed super admin:', err.message);
    process.exit(1);
  }
})();
