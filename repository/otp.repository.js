// repository/otp.repository.js
const Otp = require('../schema/Otp.schema');

const create = (data) => Otp.create(data);

const findLatestValid = (email, purpose) =>
  Otp.findOne({ email: email.toLowerCase(), purpose, verified: false })
    .sort({ createdAt: -1 });

const markVerified = (id) => Otp.findByIdAndUpdate(id, { verified: true }, { new: true });

const deleteAllForEmail = (email, purpose) =>
  Otp.deleteMany({ email: email.toLowerCase(), purpose });

module.exports = { create, findLatestValid, markVerified, deleteAllForEmail };
