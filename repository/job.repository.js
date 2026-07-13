// repository/job.repository.js
const Job = require('../schema/Job.schema');

const create = (data) => Job.create(data);

const findById = (id) => Job.findById(id);

const findByJobId = (jobId) => Job.findOne({ jobId });

const updateById = (id, update) => Job.findByIdAndUpdate(id, update, { new: true, runValidators: true });

const deleteById = (id) => Job.findByIdAndDelete(id);

const findActive = (filter = {}) => Job.find({ isActive: true, ...filter }).sort({ createdAt: -1 });

const findAll = (filter = {}) => Job.find(filter).sort({ createdAt: -1 });

const countActive = () => Job.countDocuments({ isActive: true });

const countExpired = () => Job.countDocuments({ lastDateToApply: { $lt: new Date() } });

module.exports = {
  create,
  findById,
  findByJobId,
  updateById,
  deleteById,
  findActive,
  findAll,
  countActive,
  countExpired,
};
