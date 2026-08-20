// repository/otp.repository.js
const redis = require('../config/redis');
const config = require('../config');

const makeKey = (email, purpose) => `otp:${email.toLowerCase()}:${purpose}`;

const TTL_SECONDS = config.otp.expiryMinutes * 60;

const create = async ({ email, otp, purpose }) => {
  const key = makeKey(email, purpose);
  const value = JSON.stringify({ otp, verified: false, createdAt: Date.now() });
  await redis.set(key, value, 'EX', TTL_SECONDS);
  return { email, otp, purpose };
};

// returns the stored record or null if not found / already verified
const findLatestValid = async (email, purpose) => {
  const key = makeKey(email, purpose);
  const raw = await redis.get(key);
  if (!raw) return null;
  const record = JSON.parse(raw);
  if (record.verified) return null;
  return { ...record, email, purpose, key };
};

// mark as verified — keep the key alive so completeRegistration can confirm it
const markVerified = async (email, purpose) => {
  const key = makeKey(email, purpose);
  const raw = await redis.get(key);
  if (!raw) return null;
  const record = JSON.parse(raw);
  record.verified = true;
  // keep alive for another 10 minutes for the form completion step
  await redis.set(key, JSON.stringify(record), 'EX', 10 * 60);
  return record;
};

// check if a verified otp exists (used in completeRegistration)
const findVerified = async (email, purpose) => {
  const key = makeKey(email, purpose);
  const raw = await redis.get(key);
  if (!raw) return null;
  const record = JSON.parse(raw);
  return record.verified ? record : null;
};

const deleteAllForEmail = async (email, purpose) => {
  const key = makeKey(email, purpose);
  await redis.del(key);
};

module.exports = { create, findLatestValid, markVerified, findVerified, deleteAllForEmail };