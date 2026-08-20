// controller/admin.controller.js
const adminService = require('../service/admin.service');
const config = require('../config');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const result = await adminService.login(email, password);
    res.cookie('nitkkr_admin_token', result.token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    maxAge: config.cookie.maxAgeDays * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ success: true, admin: result.admin });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('nitkkr_admin_token', { httpOnly: true, sameSite: 'lax', secure: config.env === 'production' });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const addAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.addAdmin(req.admin.id, req.body);
    res.status(201).json({ success: true, message: 'Admin added successfully', admin });
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, addAdmin, getDashboardStats, logout };
