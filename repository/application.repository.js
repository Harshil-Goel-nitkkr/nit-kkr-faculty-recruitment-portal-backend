// repository/application.repository.js
const Application = require('../schema/Application.schema');

const create = (data) => Application.create(data);

const findById = (id) => Application.findById(id).populate('job').populate('user', '-password');

const findByUserAndJob = (userId, jobId) => Application.findOne({ user: userId, job: jobId });

const findAllByUser = (userId) =>
  Application.find({ user: userId }).populate('job').sort({ createdAt: -1 });

const findAllByJob = (jobId) =>
  Application.find({ job: jobId }).populate('user', '-password').sort({ createdAt: -1 });

const updateById = (id, update) =>
  Application.findByIdAndUpdate(id, update, { new: true, runValidators: true });

const findWithUploadedDocuments = () =>
  Application.find({ 'documents.0': { $exists: true } })
    .populate('job')
    .populate('user', '-password')
    .sort({ updatedAt: -1 });

const countByStatus = (status) => Application.countDocuments({ status });

const countUnderProgress = () =>
  Application.countDocuments({ status: { $in: ['UNDER_REVIEW', 'SHORTLISTED_FOR_INTERVIEW'] } });

const countInterviewsScheduled = () =>
  Application.countDocuments({ status: 'SHORTLISTED_FOR_INTERVIEW', 'interview.date': { $exists: true } });

const countUnprocessed = () => Application.countDocuments({ status: 'SUBMITTED' });

module.exports = {
  create,
  findById,
  findByUserAndJob,
  findAllByUser,
  findAllByJob,
  updateById,
  findWithUploadedDocuments,
  countByStatus,
  countUnderProgress,
  countInterviewsScheduled,
  countUnprocessed,
};
