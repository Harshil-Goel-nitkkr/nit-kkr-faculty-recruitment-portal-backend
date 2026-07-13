// schema/Application.schema.js
const mongoose = require('mongoose');
const { educationSubSchema, experienceSubSchema, projectSubSchema } = require('./subSchemas');

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    rejectionReason: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    date: { type: Date },
    time: { type: String },
    mode: { type: String, enum: ['ONLINE', 'OFFLINE'] },
    details: { type: String },
    link: { type: String },
    venue: { type: String },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },

    // snapshot of applicant info at time of application (prefilled from profile, editable)
    firstName: String,
    lastName: String,
    email: String,
    phoneNo: String,
    address: String,
    dob: Date,
    fatherName: String,
    education: [educationSubSchema],
    experience: [experienceSubSchema],
    projects: [projectSubSchema],
    resumeUrl: String,

    status: {
      type: String,
      enum: [
        'INCOMPLETE',
        'FEE_PENDING',
        'SUBMITTED',
        'UNDER_REVIEW',
        'SHORTLISTED_FOR_INTERVIEW',
        'SELECTED',
        'REJECTED',
      ],
      default: 'INCOMPLETE',
    },
    statusHistory: [statusHistorySchema],

    isDraft: { type: Boolean, default: true },
    appliedDate: { type: Date },

    fee: {
      amount: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
      paidDate: { type: Date },
      transactionId: { type: String },
    },

    interview: interviewSchema,

    documents: [documentSchema],

    offerLetterUrl: { type: String },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
