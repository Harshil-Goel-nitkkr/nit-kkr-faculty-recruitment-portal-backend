// service/captcha.service.js
const svgCaptcha = require('svg-captcha');
const AppError = require('../utils/AppError');
const {redisClient: client} = require('../config/redis');
const CAPTCHA_TTL = 300; // time in seconds

const getCaptchaId = ()=>{
  return `captcha:${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const generateCaptcha = async () => {
  const captcha = svgCaptcha.create({ size: 5, noise: 3, color: true, width: 150, height: 50 });
  const captchaId = getCaptchaId();
  const resp =  await client.set(captchaId, captcha.text.toLowerCase(), 'EX', CAPTCHA_TTL);
  if(resp != 'OK') throw new AppError('captcha saving failed',500);
  return { captchaId, svg: captcha.data };
};

const verifyCaptcha = async (captchaId, userInput) => {
  const exists = await client.exists(captchaId);
  if(!Boolean(exists)) throw new AppError("captcha timed out", 400)
  const entry = await client.get(captchaId);
  if (!entry) return false;
  
  const match = entry === String(userInput || '').toLowerCase();
  if(match) client.del(captchaId);
  return match;
};

module.exports = { generateCaptcha, verifyCaptcha };
