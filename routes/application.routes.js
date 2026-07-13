// routes/application.routes.js
const express = require('express');
const router = express.Router();
const applicationController = require('../controller/application.controller');
const { protectUser, protectAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// ---- candidate routes ----
router.put('/draft/:jobId', protectUser, applicationController.saveDraft);
router.post('/:applicationId/submit', protectUser, applicationController.submitApplication);
router.post('/:applicationId/pay-fee/create-order', protectUser, applicationController.createFeeOrder);
router.post('/:applicationId/pay-fee/verify', protectUser, applicationController.verifyFeePayment);

router.get('/my', protectUser, applicationController.getMyApplications);
router.get('/my/:applicationId', protectUser, applicationController.getApplicationDetails);
router.post(
  '/:applicationId/documents',
  protectUser,
  upload.single('document'),
  applicationController.uploadDocument
);

// ---- admin routes ----
router.get('/admin/job/:jobId', protectAdmin, applicationController.getApplicationsForJob);
router.put('/admin/:applicationId/status', protectAdmin, applicationController.updateApplicationStatus);
router.put('/admin/:applicationId/interview', protectAdmin, applicationController.scheduleInterview);
router.post(
  '/admin/:applicationId/offer-letter',
  protectAdmin,
  upload.single('offerLetter'),
  applicationController.issueOfferLetter
);
router.get('/admin/documents/pending', protectAdmin, applicationController.getApplicationsWithDocuments);
router.put(
  '/admin/:applicationId/documents/:documentId/verify',
  protectAdmin,
  applicationController.verifyDocument
);

module.exports = router;
