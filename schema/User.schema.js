// schema/User.schema.js
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    instituteName: { type: String, required: true },
    completionDate: { type: Date, required: true },
    percentageOrCgpa: { type: String, required: true },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    instituteOrCompany: { type: String, required: true },
    role: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    endDate: { type: Date },
    duration: { type: String },
    description: { type: String },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String },
    dob: { type: Date },
    fatherName: { type: String },

    isEmailVerified: { type: Boolean, default: false },

    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],

    resumeUrl: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
