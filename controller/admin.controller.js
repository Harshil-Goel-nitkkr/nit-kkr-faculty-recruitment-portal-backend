// controller/admin.controller.js
const adminService = require('../service/admin.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const result = await adminService.login(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
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

module.exports = { login, addAdmin, getDashboardStats };
