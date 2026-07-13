// repository/user.repository.js
// All direct DB queries for User collection live here.
const User = require('../schema/User.schema');

const findByEmail = (email) => User.findOne({ email: email.toLowerCase() });

const findById = (id) => User.findById(id);

const create = (data) => User.create(data);

const updateById = (id, update) =>
  User.findByIdAndUpdate(id, update, { new: true, runValidators: true });

const updatePassword = (id, hashedPassword) =>
  User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

const markEmailVerified = (email) =>
  User.findOneAndUpdate({ email: email.toLowerCase() }, { isEmailVerified: true }, { new: true });

const countAll = () => User.countDocuments();

module.exports = {
  findByEmail,
  findById,
  create,
  updateById,
  updatePassword,
  markEmailVerified,
  countAll,
};
