const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_AUTH_USER, // generated ethereal user
    pass: process.env.NODEMAILER_AUTH_PASS, // generated ethereal password
  },
});

module.exports = mailer;
