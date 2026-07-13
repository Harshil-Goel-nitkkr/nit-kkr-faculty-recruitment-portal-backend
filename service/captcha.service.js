// service/captcha.service.js
const svgCaptcha = require('svg-captcha');

// In-memory store keyed by a captchaId issued to the client.
// will be moved to redis
const captchaStore = new Map();
const CAPTCHA_TTL_MS = 5 * 60 * 1000;

const cleanupExpired = () => {
  const now = Date.now();
  for (const [id, entry] of captchaStore.entries()) {
    if (entry.expiresAt < now) captchaStore.delete(id);
  }
};

const generateCaptcha = () => {
  cleanupExpired();
  const captcha = svgCaptcha.create({ size: 5, noise: 3, color: true, width: 150, height: 50 });
  const captchaId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  captchaStore.set(captchaId, {
    text: captcha.text.toLowerCase(),
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
  });
  return { captchaId, svg: captcha.data };
};

const verifyCaptcha = (captchaId, userInput) => {
  const entry = captchaStore.get(captchaId);
  if (!entry) return false;
  captchaStore.delete(captchaId); // one-time use
  if (entry.expiresAt < Date.now()) return false;
  return entry.text === String(userInput || '').toLowerCase();
};

module.exports = { generateCaptcha, verifyCaptcha };
