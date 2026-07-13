// controller/job.controller.js
const jobService = require('../service/job.service');

const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body, req.admin.id);
    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Job updated successfully', job });
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const result = await jobService.deleteJob(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

const listActiveJobs = async (req, res, next) => {
  try {
    const { minimumDegree, department, minExperience } = req.query;
    const jobs = await jobService.listActiveJobs({ minimumDegree, department, minExperience });
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

const listAllJobsForAdmin = async (req, res, next) => {
  try {
    const jobs = await jobService.listAllJobsForAdmin();
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

module.exports = { createJob, updateJob, deleteJob, getJobById, listActiveJobs, listAllJobsForAdmin };
