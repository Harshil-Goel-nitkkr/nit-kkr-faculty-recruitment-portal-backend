// utils/token.js
const jwt = require('jsonwebtoken');
const config = require('../config');

const signUserToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const verifyUserToken = (token) => jwt.verify(token, config.jwt.secret);

const signAdminToken = (payload) =>
  jwt.sign(payload, config.jwt.adminSecret, { expiresIn: config.jwt.adminExpiresIn });

const verifyAdminToken = (token) => jwt.verify(token, config.jwt.adminSecret);

module.exports = { signUserToken, verifyUserToken, signAdminToken, verifyAdminToken };
