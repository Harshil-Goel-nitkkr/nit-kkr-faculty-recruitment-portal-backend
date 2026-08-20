// middleware/auth.middleware.js
const { verifyUserToken, verifyAdminToken } = require('../utils/token');
const AppError = require('../utils/AppError');

const protectUser = (req, res, next) => {
  try {
    const token = req.cookies?.nitkkr_token;
    if (!token) {
      throw new AppError('Not authenticated. Please login.', 401);
    }
    const decoded = verifyUserToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired session. Please login again.', 401));
  }
};

const protectAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.nitkkr_admin_token;
    if (!token) {
      throw new AppError('Not authenticated. Please login.', 401);
    }
    const decoded = verifyAdminToken(token);
    req.admin = decoded; // { id, email, role }
    next();
  } catch (err) {
    next(new AppError('Invalid or expired admin session. Please login again.', 401));
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'SUPER_ADMIN') {
    return next(new AppError('Only super admins can perform this action', 403));
  }
  next();
};

module.exports = { protectUser, protectAdmin, requireSuperAdmin };
