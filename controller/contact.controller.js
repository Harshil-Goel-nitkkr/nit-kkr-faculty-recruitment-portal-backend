// controller/contact.controller.js
const { sendMail } = require('../config/mailer');
const config = require('../config');
const AppError = require('../utils/AppError');

const sendContactMail = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      throw new AppError('All fields are required', 400);
    }

    await sendMail({
      to: config.mail.instituteContactEmail,
      subject: `[Contact Us] ${subject}`,
      html: `<p><b>From:</b> ${name} (${email})</p><p>${message}</p>`,
    });

    res.status(200).json({ success: true, message: 'Your message has been sent to the institute' });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendContactMail };
