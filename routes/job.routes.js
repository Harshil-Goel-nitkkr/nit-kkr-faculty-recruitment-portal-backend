// routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controller/job.controller');
const { protectAdmin } = require('../middleware/auth.middleware');

// public - listing for candidates
router.get('/', jobController.listActiveJobs);

// admin only (must be declared before the '/:id' route below)
router.get('/admin/all', protectAdmin, jobController.listAllJobsForAdmin);
router.post('/', protectAdmin, jobController.createJob);

router.get('/:id', jobController.getJobById);
router.put('/:id', protectAdmin, jobController.updateJob);
router.delete('/:id', protectAdmin, jobController.deleteJob);

module.exports = router;
