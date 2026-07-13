// schema/subSchemas.js
const mongoose = require('mongoose');

const educationSubSchema = new mongoose.Schema(
  {
    degree: String,
    instituteName: String,
    completionDate: Date,
    percentageOrCgpa: String,
  },
  { _id: false }
);

const experienceSubSchema = new mongoose.Schema(
  {
    instituteOrCompany: String,
    role: String,
    joiningDate: Date,
    endDate: Date,
    duration: String,
    description: String,
  },
  { _id: false }
);

const projectSubSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    link: String,
  },
  { _id: false }
);

module.exports = { educationSubSchema, experienceSubSchema, projectSubSchema };
