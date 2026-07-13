// service/job.service.js
const jobRepository = require('../repository/job.repository');
const AppError = require('../utils/AppError');

const createJob = async (data, adminId) => {
  const existing = await jobRepository.findByJobId(data.jobId);
  if (existing) throw new AppError('A job with this Job ID already exists', 409);
  return jobRepository.create({ ...data, createdBy: adminId });
};

const updateJob = async (id, data) => {
  const job = await jobRepository.updateById(id, data);
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

const deleteJob = async (id) => {
  const job = await jobRepository.deleteById(id);
  if (!job) throw new AppError('Job not found', 404);
  return { message: 'Job removed successfully' };
};

const getJobById = async (id) => {
  const job = await jobRepository.findById(id);
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

// filters: minimumDegree, department, minExperience
const listActiveJobs = async ({ minimumDegree, department, minExperience }) => {
  const filter = {};
  if (minimumDegree) filter.minimumDegree = minimumDegree;
  if (department) filter.department = department;
  if (minExperience !== undefined) filter.experienceRequiredYears = { $lte: Number(minExperience) };
  return jobRepository.findActive(filter);
};

const listAllJobsForAdmin = async () => jobRepository.findAll();

module.exports = { createJob, updateJob, deleteJob, getJobById, listActiveJobs, listAllJobsForAdmin };
