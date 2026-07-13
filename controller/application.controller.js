// controller/application.controller.js
const applicationService = require('../service/application.service');

const saveDraft = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const application = await applicationService.saveDraft(req.user.id, jobId, req.body);
    res.status(200).json({ success: true, message: 'Draft saved successfully', application });
  } catch (err) {
    next(err);
  }
};

const submitApplication = async (req, res, next) => {
  try {
    const application = await applicationService.submitApplication(req.user.id, req.params.applicationId);
    res.status(200).json({ success: true, message: 'Application submitted successfully', application });
  } catch (err) {
    next(err);
  }
};

const payFee = async (req, res, next) => {
  try {
    const result = await applicationService.payApplicationFee(req.user.id, req.params.applicationId, req.body);
    res.status(200).json({ success: true, message: 'Payment successful, application submitted', ...result });
  } catch (err) {
    next(err);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getMyApplications(req.user.id);
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

const getApplicationDetails = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationDetails(req.user.id, req.params.applicationId);
    res.status(200).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const application = await applicationService.uploadShortlistDocument(
      req.user.id,
      req.params.applicationId,
      req.body.name,
      fileUrl
    );
    res.status(200).json({ success: true, message: 'Document uploaded successfully', application });
  } catch (err) {
    next(err);
  }
};

// ---- Admin controllers ----

const getApplicationsForJob = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsForJob(req.params.jobId);
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const application = await applicationService.updateApplicationStatus(req.params.applicationId, status, note);
    res.status(200).json({ success: true, message: 'Status updated successfully', application });
  } catch (err) {
    next(err);
  }
};

const scheduleInterview = async (req, res, next) => {
  try {
    const application = await applicationService.scheduleInterview(req.params.applicationId, req.body);
    res.status(200).json({ success: true, message: 'Interview/test scheduled successfully', application });
  } catch (err) {
    next(err);
  }
};

const issueOfferLetter = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Offer letter file is required' });
    const offerLetterUrl = `/uploads/${req.file.filename}`;
    const application = await applicationService.issueOfferLetter(req.params.applicationId, offerLetterUrl);
    res.status(200).json({ success: true, message: 'Offer letter issued successfully', application });
  } catch (err) {
    next(err);
  }
};

const getApplicationsWithDocuments = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsWithDocuments();
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

const verifyDocument = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const application = await applicationService.verifyDocument(
      req.params.applicationId,
      req.params.documentId,
      status,
      rejectionReason
    );
    res.status(200).json({ success: true, message: 'Document verification updated', application });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveDraft,
  submitApplication,
  payFee,
  getMyApplications,
  getApplicationDetails,
  uploadDocument,
  getApplicationsForJob,
  updateApplicationStatus,
  scheduleInterview,
  issueOfferLetter,
  getApplicationsWithDocuments,
  verifyDocument,
};
