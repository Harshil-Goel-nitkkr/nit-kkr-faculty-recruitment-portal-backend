// config/mailer.js
const AppError = require('../utils/AppError');
const config = require('./index');
const Mailjet = require ('node-mailjet');


const sendMail = async ({ to, subject, html, text }) => {
  
  const mailjet = Mailjet.apiConnect(config.mailjet.api_key_public, config.mailjet.api_key_private);
  const request = mailjet
  .post("send", {'version': 'v3'})
  .request({
        "FromEmail":"harshilgoel2007@gmail.com",
        "FromName":"NIT KKR FACULTY RECRUITMENT PORTAL",
        "Recipients":[
          {
            "Email":to,
          }
        ],
        "Subject":subject,
        "Text-part":text,
        "Html-part":html
      });

  request.then((result) => {
    return result.body;
  })
	.catch((err) => {
		throw new AppError('unable to send email',500);
	})

};

module.exports = {sendMail };





