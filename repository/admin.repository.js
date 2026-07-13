// repository/admin.repository.js
const Admin = require('../schema/Admin.schema');

const findByEmail = (email) => Admin.findOne({ email: email.toLowerCase() });
const findById = (id) => Admin.findById(id);
const create = (data) => Admin.create(data);
const findAll = () => Admin.find().select('-password');

module.exports = { findByEmail, findById, create, findAll };
