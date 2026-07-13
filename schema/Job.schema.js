// schema/Job.schema.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true }, // human readable e.g. NITKKR/2026/CSE/01
    title: { type: String, required: true },
    department: { type: String, required: true },
    minimumDegree: {
      type: String,
      enum: ['BTech', 'MTech', 'PhD', 'MSc', 'MA', 'MCA', 'Other'],
      required: true,
    },
    experienceRequiredYears: { type: Number, default: 0 },
    requirements: { type: String, required: true }, // short summary shown on card
    eligibility: { type: String, required: true },
    minimumRequirements: { type: String, required: true },
    preferredSkills: { type: String },
    expectedSalary: { type: String },
    benefits: { type: String },
    numberOfOpenings: { type: Number, required: true, default: 1 },
    lastDateToApply: { type: Date, required: true },
    applicationFee: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

jobSchema.index({ minimumDegree: 1, department: 1, experienceRequiredYears: 1 });

module.exports = mongoose.model('Job', jobSchema);
