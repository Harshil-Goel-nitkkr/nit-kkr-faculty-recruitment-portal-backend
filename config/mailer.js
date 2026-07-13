// config/mailer.js
const nodemailer = require('nodemailer');
const config = require('./index');

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.port === 465,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

const sendMail = async ({ to, subject, html, text }) => {
  return transporter.sendMail({
    from: config.mail.from,
    to,
    subject,
    html,
    text,
  });
};

module.exports = { transporter, sendMail };
