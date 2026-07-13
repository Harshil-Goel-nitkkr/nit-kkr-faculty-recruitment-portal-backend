// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const { protectAdmin, requireSuperAdmin } = require('../middleware/auth.middleware');

router.post('/login', adminController.login);
router.get('/dashboard-stats', protectAdmin, adminController.getDashboardStats);
router.post('/add-admin', protectAdmin, requireSuperAdmin, adminController.addAdmin);

module.exports = router;
