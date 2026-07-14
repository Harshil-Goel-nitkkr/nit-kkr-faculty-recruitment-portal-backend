// service/application.service.js
const applicationRepository = require('../repository/application.repository');
const jobRepository = require('../repository/job.repository');
const userRepository = require('../repository/user.repository');
const { sendMail } = require('../config/mailer');
const AppError = require('../utils/AppError');
const config = require('../config/index');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Creates or updates a draft application (prefilled from profile, user can edit before submitting)
const saveDraft = async (userId, jobId, formData) => {
  const job = await jobRepository.findById(jobId);
  if (!job) throw new AppError('Job not found', 404);
  if (job.lastDateToApply < new Date()) throw new AppError('Application deadline has passed', 400);

  let application = await applicationRepository.findByUserAndJob(userId, jobId);

  const payload = {
    ...formData,
    user: userId,
    job: jobId,
    email: undefined, // email can never be edited, always taken from user profile
  };

  if (!application) {
    const user = await userRepository.findById(userId);
    application = await applicationRepository.create({
      ...payload,
      email: user.email,
      status: 'INCOMPLETE',
      isDraft: true,
      fee: { amount: job.applicationFee, isPaid: false },
      statusHistory: [{ status: 'INCOMPLETE', note: 'Draft created' }],
    });
  } else {
    if (!['INCOMPLETE', 'FEE_PENDING'].includes(application.status)) {
      throw new AppError('This application has already been submitted and can no longer be edited', 400);
    }
    delete payload.email;
    application = await applicationRepository.updateById(application._id, payload);
  }

  return application;
};

// Final submission - requires fee to be paid if applicable, marks SUBMITTED
const submitApplication = async (userId, applicationId) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);
  if (String(application.user._id) !== String(userId)) throw new AppError('Not authorized', 403);

  if (application.status === "SUBMITTED") {
    throw new AppError("Application already submitted", 400);
  }

  if (application.status === "REJECTED") {
    throw new AppError("Rejected applications cannot be submitted", 400);
  }

  if (application.fee.amount > 0 && !application.fee.isPaid) {
    await applicationRepository.updateById(applicationId, { status: 'FEE_PENDING' });
    throw new AppError('Please complete the fee payment before submitting', 400);
  }

  const updated = await applicationRepository.updateById(applicationId, {
    status: 'SUBMITTED',
    isDraft: false,
    appliedDate: new Date(),
    $push: { statusHistory: { status: 'SUBMITTED', note: 'Application submitted by candidate' } },
  });

  return updated;
};

// payment gateway with razorpay integeration
var instance = new Razorpay({ key_id: config.payment.razorpay_keyId, key_secret: config.payment.razorpay_keySecret });
const createFeeOrder = async(userId, applicationId, paymentDetails) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);
  if (String(application.user._id) !== String(userId)) throw new AppError('Not authorized', 403);
  if (application.fee.isPaid) throw new AppError('Fee already paid for this application', 400);
  
  const order = await instance.orders.create({
    amount: parseInt(paymentDetails.amount), // in paise
    currency: "INR",
  });

  return order;
}

const verifyFeePayment = async(userId, applicationId, paymentDetails) => {
  const transactionId = paymentDetails.Razorpay_payment_id;

  const generatedSignature = crypto
    .createHmac("sha256", config.payment.razorpay_keySecret)
    .update(`${paymentDetails.razorpay_order_id}|${paymentDetails.razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === paymentDetails.razorpay_signature) {
    const updated = await applicationRepository.updateById(applicationId, {
      'fee.isPaid': true,
      'fee.paidDate': new Date(),
      'fee.transactionId': transactionId,
      status: 'SUBMITTED',
      isDraft: false,
      appliedDate: new Date(),
      $push: { statusHistory: { status: 'SUBMITTED', note: 'Fee paid and application submitted' } },
    });
    return { application: updated, transactionId };
  } else {
    throw new AppError('Payment not Failed', 402)
  }

  
}

const getMyApplications = async (userId) => applicationRepository.findAllByUser(userId);

const getApplicationDetails = async (userId, applicationId) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);
  if (String(application.user._id) !== String(userId)) throw new AppError('Not authorized', 403);
  return application;
};

const uploadShortlistDocument = async (userId, applicationId, name, fileUrl) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);
  if (String(application.user._id) !== String(userId)) throw new AppError('Not authorized', 403);
  if (application.status !== 'SHORTLISTED_FOR_INTERVIEW' && application.status !== 'SELECTED') {
    throw new AppError('Document upload is only allowed for shortlisted candidates', 400);
  }

  const updated = await applicationRepository.updateById(applicationId, {
    $push: { documents: { name, fileUrl, verificationStatus: 'PENDING' } },
  });
  return updated;
};

// ---- Admin side operations ----

const getApplicationsForJob = async (jobId) => applicationRepository.findAllByJob(jobId);

const updateApplicationStatus = async (applicationId, status, note) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);

  const updated = await applicationRepository.updateById(applicationId, {
    status,
    $push: { statusHistory: { status, note } },
  });

  await sendMail({
    to: application.email,
    subject: `NIT Kurukshetra Recruitment - Application Status Update`,
    html: `<p>Dear ${application.firstName},</p><p>Your application status for job <b>${application.job.title}</b> has been updated to <b>${status}</b>.${note ? ` Note: ${note}` : ''}</p>`,
  });

  return updated;
};

const scheduleInterview = async (applicationId, interviewDetails) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);

  const updated = await applicationRepository.updateById(applicationId, {
    status: 'SHORTLISTED_FOR_INTERVIEW',
    interview: interviewDetails,
    $push: { statusHistory: { status: 'SHORTLISTED_FOR_INTERVIEW', note: 'Interview/Test scheduled' } },
  });

  await sendMail({
    to: application.email,
    subject: `NIT Kurukshetra Recruitment - Interview/Test Scheduled`,
    html: `<p>Dear ${application.firstName},</p>
      <p>You have been shortlisted for an interview/test for <b>${application.job.title}</b>.</p>
      <p>Date: ${interviewDetails.date} | Time: ${interviewDetails.time} | Mode: ${interviewDetails.mode}</p>
      <p>${interviewDetails.details || ''}</p>`,
  });

  return updated;
};

const issueOfferLetter = async (applicationId, offerLetterUrl) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);

  const updated = await applicationRepository.updateById(applicationId, {
    status: 'SELECTED',
    offerLetterUrl,
    $push: { statusHistory: { status: 'SELECTED', note: 'Offer letter issued' } },
  });

  await sendMail({
    to: application.email,
    subject: `Congratulations! Offer Letter - NIT Kurukshetra`,
    html: `<p>Dear ${application.firstName},</p><p>Congratulations! You have been selected for <b>${application.job.title}</b>. Please log in to the portal to download your offer letter.</p>`,
  });

  return updated;
};

const getApplicationsWithDocuments = async () => applicationRepository.findWithUploadedDocuments();

const verifyDocument = async (applicationId, documentId, status, rejectionReason) => {
  const application = await applicationRepository.findById(applicationId);
  if (!application) throw new AppError('Application not found', 404);

  const doc = application.documents.id(documentId);
  if (!doc) throw new AppError('Document not found', 404);

  doc.verificationStatus = status;
  if (status === 'REJECTED') doc.rejectionReason = rejectionReason;
  await application.save();

  return application;
};

module.exports = {
  saveDraft,
  submitApplication,
  createFeeOrder,
  verifyFeePayment,
  getMyApplications,
  getApplicationDetails,
  uploadShortlistDocument,
  getApplicationsForJob,
  updateApplicationStatus,
  scheduleInterview,
  issueOfferLetter,
  getApplicationsWithDocuments,
  verifyDocument,
};
