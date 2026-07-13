// service/admin.service.js
const bcrypt = require('bcryptjs');
const adminRepository = require('../repository/admin.repository');
const userRepository = require('../repository/user.repository');
const jobRepository = require('../repository/job.repository');
const applicationRepository = require('../repository/application.repository');
const { signAdminToken } = require('../utils/token');
const AppError = require('../utils/AppError');

const login = async (email, password) => {
  const admin = await adminRepository.findByEmail(email);
  if (!admin) throw new AppError('Invalid email or password', 401);
  if (!admin.isActive) throw new AppError('Your admin account has been deactivated', 403);

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = signAdminToken({ id: admin._id, email: admin.email, role: admin.role });
  const adminObj = admin.toObject();
  delete adminObj.password;

  return { token, admin: adminObj };
};

const addAdmin = async (creatorId, { name, email, password, role }) => {
  const existing = await adminRepository.findByEmail(email);
  if (existing) throw new AppError('An admin with this email already exists', 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await adminRepository.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'ADMIN',
    createdBy: creatorId,
  });

  const adminObj = admin.toObject();
  delete adminObj.password;
  return adminObj;
};

const getDashboardStats = async () => {
  const [
    totalUsers,
    openJobs,
    expiredJobs,
    unprocessedApplications,
    underProgress,
    interviewsScheduled,
    selected,
    rejected,
  ] = await Promise.all([
    userRepository.countAll(),
    jobRepository.countActive(),
    jobRepository.countExpired(),
    applicationRepository.countUnprocessed(),
    applicationRepository.countUnderProgress(),
    applicationRepository.countInterviewsScheduled(),
    applicationRepository.countByStatus('SELECTED'),
    applicationRepository.countByStatus('REJECTED'),
  ]);

  return {
    totalUsers,
    openJobs,
    expiredJobs,
    unprocessedApplications,
    applicationsUnderProgress: underProgress,
    interviewsScheduled,
    selected,
    rejected,
  };
};

module.exports = { login, addAdmin, getDashboardStats };
